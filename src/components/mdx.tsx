import defaultMdxComponents from 'fumadocs-ui/mdx';
import { Steps, Step } from 'fumadocs-ui/components/steps';
import { Tabs, Tab } from 'fumadocs-ui/components/tabs';
import { Files, File, Folder } from 'fumadocs-ui/components/files';
import { Accordions, Accordion } from 'fumadocs-ui/components/accordion';
import { TypeTable } from 'fumadocs-ui/components/type-table';
import { AIAgentCallout } from '@/components/docs/ai-agent-callout';
import type { MDXComponents } from 'mdx/types';

export function getMDXComponents(components?: MDXComponents) {
    return {
        ...defaultMdxComponents,
        Steps,
        Step,
        Tabs,
        Tab,
        Files,
        File,
        Folder,
        Accordions,
        Accordion,
        TypeTable,
        AIAgentCallout,
        ...components,
    } satisfies MDXComponents;
}

export const useMDXComponents = getMDXComponents;

declare global {
    type MDXProvidedComponents = ReturnType<typeof getMDXComponents>;
}
