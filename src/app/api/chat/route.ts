import { createOpenRouter } from '@openrouter/ai-sdk-provider';
import {
  convertToModelMessages,
  createUIMessageStreamResponse,
  stepCountIs,
  streamText,
  tool,
  toUIMessageStream,
} from 'ai';
import { z } from 'zod';
import { source } from '@/lib/source';
import { Document, type DocumentData } from 'flexsearch';
import type { ChatUIMessage, SearchTool } from '@/components/ai/search';

interface CustomDocument extends DocumentData {
  url: string;
  title: string;
  description: string;
  content: string;
}

let searchServer: Promise<Document<CustomDocument>> | undefined;

/** Built on the first question, so `next build` never indexes the docs. */
function getSearchServer() {
  return (searchServer ??= createSearchServer());
}

async function createSearchServer() {
  const search = new Document<CustomDocument>({
    document: {
      id: 'url',
      index: ['title', 'description', 'content'],
      store: true,
    },
  });

  const docs = await chunkedAll(
    source.getPages().map(async (page) => {
      if (!('getText' in page.data)) return null;

      return {
        title: page.data.title,
        description: page.data.description,
        url: page.url,
        content: stripFrontmatter(await page.data.getText('raw')),
      } as CustomDocument;
    }),
  );

  for (const doc of docs) {
    if (doc) search.add(doc);
  }

  return search;
}

function stripFrontmatter(text: string) {
  return text.replace(/^---\r?\n[\s\S]*?\r?\n---\r?\n?/, '');
}

const SNIPPET_LENGTH = 1200;

function toSnippet(content: string) {
  return content.replace(/\s+/g, ' ').trim().slice(0, SNIPPET_LENGTH);
}

async function chunkedAll<O>(promises: Promise<O>[]): Promise<O[]> {  const SIZE = 50;
  const out: O[] = [];
  for (let i = 0; i < promises.length; i += SIZE) {
    out.push(...(await Promise.all(promises.slice(i, i + SIZE))));
  }
  return out;
}

const openrouter = createOpenRouter({
  apiKey: process.env.OPENROUTER_API_KEY,
});

/** System prompt, you can update it to provide more specific information */
const systemPrompt = [
  'You are an AI assistant for a documentation site.',
  'Use the `search` tool to retrieve relevant docs context before answering when needed.',
  'A user message may begin with [Client Context], the page they are reading. For questions about "this page", search its title.',
  'The `search` tool returns matched pages, each with `url`, `title` and a `content` snippet. Ground your answer in those snippets and cite pages as markdown links using their `url`.',
  'If you cannot find the answer in search results, say you do not know and suggest a better search query.',
].join('\n');

export async function POST(req: Request) {
  const reqJson = await req.json();

  const result = streamText({
    model: openrouter.chat(process.env.OPENROUTER_MODEL ?? 'anthropic/claude-3.5-sonnet'),
    stopWhen: stepCountIs(5),
    maxOutputTokens: 2000,
    tools: {
      search: searchTool,
    },
    instructions: systemPrompt,
    messages: await convertToModelMessages<ChatUIMessage>(reqJson.messages ?? [], {
      convertDataPart(part) {
        if (part.type === 'data-client')
          return {
            type: 'text',
            text: `[Client Context: ${JSON.stringify(part.data)}]`,
          };
      },
    }),
    toolChoice: 'auto',
  });

  return createUIMessageStreamResponse({
    stream: toUIMessageStream({ stream: result.stream }),
  });
}

const searchTool = tool({
  description:
    'Search the Jetic docs and return the best matching pages with a snippet of each.',
  inputSchema: z.object({
    query: z.string(),
    limit: z.number().int().min(1).max(20).default(5),
  }),
  async execute({ query, limit }) {
    const search = await getSearchServer();
    const results = (await search.searchAsync(query, {
      limit,
      merge: true,
      enrich: true,
    })) as unknown as { doc: CustomDocument }[];

    return results.map(({ doc }) => ({
      doc: {
        url: doc.url,
        title: doc.title,
        content: toSnippet(doc.content),
      },
    }));
  },
}) satisfies SearchTool;