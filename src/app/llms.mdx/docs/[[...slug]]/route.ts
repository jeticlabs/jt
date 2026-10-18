import { source } from '@/lib/source';
import { notFound } from 'next/navigation';

export async function GET(
  _req: Request,
  { params }: RouteContext<'/llms.mdx/docs/[[...slug]]'>,
) {
  const { slug } = await params;
  const page = source.getPage(slug);

  if (!page) notFound();

  const content = await page.data.getText('raw');

  return new Response(content, {
    headers: {
      'Content-Type': 'text/markdown; charset=utf-8',
    },
  });
}

export function generateStaticParams() {
  return source.generateParams();
}
