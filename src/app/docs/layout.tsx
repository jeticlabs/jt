import { source } from "@/lib/source";
import { DocsAIChatLayout } from "@/components/docs/ai-chat-layout";

export default function Layout({ children }: LayoutProps<"/docs">) {
  return (
    <DocsAIChatLayout tree={source.getPageTree()}>{children}</DocsAIChatLayout>
  );
}
