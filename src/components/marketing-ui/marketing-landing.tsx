import PageShell, { type CtaCopy } from "./page-shell";
import {
  MarketingBlocks,
  PageHero,
  type PageDefinition,
} from "./page-sections";

export default function MarketingLanding({
  page,
  cta,
}: {
  page: PageDefinition;
  cta?: Partial<CtaCopy>;
}) {
  return (
    <PageShell cta={cta}>
      <PageHero page={page} />
      <MarketingBlocks blocks={page.blocks ?? []} />
    </PageShell>
  );
}
