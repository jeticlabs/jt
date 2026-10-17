# Jetic Frontend Architecture — Production-Grade Next.js Structure

For Jetic, I would build the frontend as a feature-oriented Next.js application with clear boundaries between the marketing website, documentation, authentication, and the actual developer workspace.

The goal is not to create the most folders possible. It is to make Jetic easy to extend, test, debug, and maintain as the product grows from an API testing toolkit into an agent-powered developer workspace.

I’m assuming Next.js App Router, TypeScript, Tailwind CSS, and your existing Jetic backend API.

Next.js supports this architecture through route groups, nested layouts, and its standard project conventions. Route groups allow you to organise sections independently without adding those group names to the URL.

![](https://www.google.com/s2/favicons?domain=https://nextjs.org\&sz=32)

Next.js

+1

## 1. The architecture I recommend

Public website

Landing page · Features · Product demos · Pricing · Changelog

Documentation and authentication

Docs · Sign in · Sign up · Repository connection

Jetic developer workspace

Dashboard · AI agent · Simulations · Repositories · Environments · Settings

Application infrastructure

Typed API clients · Authentication · Validation · Backend services · Testing

My main architectural decision: use one Next.js application initially, but give each major area its own route structure and layout. Keep feature-specific code inside its own module rather than putting everything into global `components/`, `hooks/`, and `utils/` folders.

This avoids the overhead of multiple frontend applications while leaving room to split the marketing site or documentation into separate deployments later.

## 2. The complete folder structure

Here is the structure I would use for Jetic's production frontend.

```
jetic-web/
│
├── public/
│   ├── brand/
│   │   ├── jetic-logo.svg
│   │   ├── jetic-mark.svg
│   │   └── jetic-wordmark.svg
│   ├── images/
│   │   ├── product/
│   │   ├── integrations/
│   │   └── social/
│   ├── icons/
│   └── fonts/
│
├── content/
│   └── docs/
│       ├── getting-started.mdx
│       ├── installation.mdx
│       ├── simulations.mdx
│       ├── mcp.mdx
│       └── configuration.mdx
│
├── src/
│   │
│   ├── app/
│   │   ├── layout.tsx
│   │   ├── globals.css
│   │   ├── not-found.tsx
│   │   ├── global-error.tsx
│   │   │
│   │   ├── (marketing)/
│   │   │   ├── layout.tsx
│   │   │   ├── page.tsx
│   │   │   ├── features/
│   │   │   │   └── page.tsx
│   │   │   ├── how-it-works/
│   │   │   │   └── page.tsx
│   │   │   ├── pricing/
│   │   │   │   └── page.tsx
│   │   │   ├── changelog/
│   │   │   │   └── page.tsx
│   │   │   ├── contact/
│   │   │   │   └── page.tsx
│   │   │   └── legal/
│   │   │       ├── privacy/
│   │   │       │   └── page.tsx
│   │   │       └── terms/
│   │   │           └── page.tsx
│   │   │
│   │   ├── (auth)/
│   │   │   ├── sign-in/
│   │   │   │   └── page.tsx
│   │   │   ├── sign-up/
│   │   │   │   └── page.tsx
│   │   │   └── callback/
│   │   │       └── route.ts
│   │   │
│   │   ├── (product)/
│   │   │   └── app/
│   │   │       ├── layout.tsx
│   │   │       ├── page.tsx
│   │   │       │
│   │   │       ├── dashboard/
│   │   │       │   └── page.tsx
│   │   │       │
│   │   │       ├── onboarding/
│   │   │       │   └── page.tsx
│   │   │       │
│   │   │       └── workspaces/
│   │   │           └── [workspaceId]/
│   │   │               ├── layout.tsx
│   │   │               ├── page.tsx
│   │   │               │
│   │   │               ├── agent/
│   │   │               │   └── page.tsx
│   │   │               │
│   │   │               ├── repositories/
│   │   │               │   └── page.tsx
│   │   │               │
│   │   │               ├── simulations/
│   │   │               │   ├── page.tsx
│   │   │               │   └── [simulationId]/
│   │   │               │       └── page.tsx
│   │   │               │
│   │   │               ├── environments/
│   │   │               │   └── page.tsx
│   │   │               │
│   │   │               └── settings/
│   │   │                   └── page.tsx
│   │   │
│   │   ├── docs/
│   │   │   └── [[...slug]]/
│   │   │       └── page.tsx
│   │   │
│   │   └── api/
│   │       └── health/
│   │           └── route.ts
│   │
│   ├── components/
│   │   ├── ui/
│   │   │   ├── button.tsx
│   │   │   ├── input.tsx
│   │   │   ├── dialog.tsx
│   │   │   ├── dropdown-menu.tsx
│   │   │   ├── tooltip.tsx
│   │   │   └── skeleton.tsx
│   │   │
│   │   ├── feedback/
│   │   │   ├── empty-state.tsx
│   │   │   ├── error-state.tsx
│   │   │   └── loading-state.tsx
│   │   │
│   │   └── providers/
│   │       ├── query-provider.tsx
│   │       └── theme-provider.tsx
│   │
│   ├── features/
│   │   ├── marketing/
│   │   ├── auth/
│   │   ├── workspace/
│   │   ├── repository/
│   │   ├── agent/
│   │   ├── simulation/
│   │   ├── environment/
│   │   └── settings/
│   │
│   ├── lib/
│   │   ├── api/
│   │   │   ├── client.ts
│   │   │   ├── endpoints.ts
│   │   │   └── errors.ts
│   │   ├── env.ts
│   │   ├── logger.ts
│   │   ├── utils.ts
│   │   └── constants.ts
│   │
│   ├── server/
│   │   ├── auth/
│   │   ├── api/
│   │   └── security/
│   │
│   ├── hooks/
│   ├── config/
│   └── types/
│
├── tests/
│   ├── unit/
│   ├── integration/
│   └── e2e/
│
├── .github/
│   └── workflows/
│       └── ci.yml
│
├── .env.example
├── .gitignore
├── eslint.config.mjs
├── next.config.ts
├── package.json
├── playwright.config.ts
├── tsconfig.json
└── README.md
```

This is the target structure, not a command to create every empty folder immediately. Add feature directories as you implement their functionality.

## 3. The most important part: structure each feature properly

The `features/` folder is the heart of the architecture. Each feature should own its components, API operations, validation schemas, hooks, and types.

For example, Jetic’s AI agent should not have 30 files scattered across global `components`, `hooks`, and `utils` directories.

I would structure it like this:

```
src/features/agent/
│
├── components/
│   ├── agent-workspace.tsx
│   ├── agent-sidebar.tsx
│   ├── agent-conversation.tsx
│   ├── agent-composer.tsx
│   ├── model-selector.tsx
│   ├── agent-mode-selector.tsx
│   ├── task-timeline.tsx
│   ├── tool-invocation-card.tsx
│   ├── execution-approval-dialog.tsx
│   └── generated-output-card.tsx
│
├── hooks/
│   ├── use-agent-session.ts
│   └── use-agent-events.ts
│
├── api/
│   └── agent.api.ts
│
├── schemas/
│   └── agent.schema.ts
│
├── types/
│   └── agent.types.ts
│
├── utils/
│   └── normalize-agent-event.ts
│
└── index.ts
```

This module supports the Jetic experience you're planning: a generic agent workspace, model selection, fast or planning-oriented modes, visible task execution, tool calls, and generated simulation results.

Here's how the responsibilities should be divided:

| Folder        | Responsibility                                      |
| ------------- | --------------------------------------------------- |
| `components/` | UI belonging exclusively to the agent               |
| `hooks/`      | Agent-specific React state and interaction logic    |
| `api/`        | Typed functions for talking to the agent backend    |
| `schemas/`    | Runtime validation for inputs and backend responses |
| `types/`      | TypeScript types specific to agent functionality    |
| `utils/`      | Pure helper functions for transforming agent data   |

The same pattern can be applied to `simulation`, `repository`, `workspace`, and `environment` wherever complexity justifies it. Keep small features small instead of mechanically creating every folder in advance.

## 4. How the main Jetic features should be separated

`features/agent/`

Conversation UI, execution timeline, model selection, planning, tool invocations, task status, and generated outputs.

`features/simulation/`

Simulation creation, scenario configuration, run history, results, failures, request/response inspection, and replay controls.

`features/repository/`

GitHub connection, repository selection, branch information, source-code indexing status, and repository permissions.

`features/workspace/`

Workspace navigation, project context, collapsed sidebar state, workspace switching, and shared workspace metadata.

`features/environment/` and `features/settings/`

Environment configuration, safe secret references, preferences, integrations, and workspace configuration.

A simulation launched by the agent should still use the simulation feature's data model and result components. The agent can initiate the operation and present the result, but it shouldn't duplicate the simulation engine or create a separate implementation of simulation history.

That is an important separation of responsibilities.

## 5. Keep `app/` thin

The `app/` directory should primarily define routes, layouts, route-level data loading, metadata, and loading or error boundaries. It should not become the location for all your product logic.

For example:

```
app/
└── (product)/
    └── app/
        └── workspaces/
            └── [workspaceId]/
                └── simulations/
                    ├── page.tsx
                    └── [simulationId]/
                        └── page.tsx
```

Those routes can render components owned by `features/simulation/`. Route groups such as `(product)` are organisational and don't add their names to the URL.

![](https://www.google.com/s2/favicons?domain=https://nextjs.org\&sz=32)

Next.js

+1

With this structure, the URLs become:

| Route              | URL                                                      |
| ------------------ | -------------------------------------------------------- |
| Landing page       | `/`                                                      |
| Product features   | `/features`                                              |
| Documentation      | `/docs/...`                                              |
| Sign in            | `/sign-in`                                               |
| Dashboard          | `/app/dashboard`                                         |
| Agent workspace    | `/app/workspaces/:workspaceId/agent`                     |
| Simulation history | `/app/workspaces/:workspaceId/simulations`               |
| Simulation details | `/app/workspaces/:workspaceId/simulations/:simulationId` |

Your marketing and product layouts can have completely different navigation, styling, and page structure while sharing the application's root layout.

## 6. What belongs in the global folders?

`components/ui/`

Reusable design primitives: buttons, inputs, dialogs, dropdowns, tooltips, and popovers. Keep these independent of Jetic's business logic.

`lib/`

Shared infrastructure such as the base HTTP client, error types, environment parsing, and general-purpose utilities.

`server/`

Server-only authentication helpers, privileged backend integrations, and security-sensitive operations. Mark private modules with `import 'server-only'` where appropriate.

`hooks/`

Only hooks genuinely shared by multiple unrelated features. Keep `use-agent-session` within the agent feature rather than moving it here.

`types/`

Application-wide types only. Keep agent, simulation, and repository types next to their respective features.

One security rule matters especially for Jetic: the frontend must not be trusted to authorise agent actions or simulation execution. It should call your backend, which enforces identity, permissions, and execution policies. Never expose private API keys through `NEXT_PUBLIC_` environment variables.

Also, Next.js App Router components are Server Components by default. Introduce `"use client"` only at the components that actually need client-side interaction, browser APIs, or React state—not at the top of every page.

![](https://www.google.com/s2/favicons?domain=https://nextjs.org\&sz=32)

Next.js

+1

## 7. Testing structure

I would use a combination of unit, integration, and end-to-end tests:

```
tests/
├── unit/
│   ├── api-client.test.ts
│   └── normalize-agent-event.test.ts
│
├── integration/
│   ├── repository-connection.test.ts
│   └── simulation-workflow.test.ts
│
└── e2e/
    ├── landing.spec.ts
    ├── authentication.spec.ts
    ├── connect-repository.spec.ts
    └── agent-simulation.spec.ts
```

Use Vitest for isolated logic and component tests, and Playwright for full browser workflows. Next.js officially documents both approaches and recommends end-to-end testing for async Server Components, which some unit-test setups do not support directly.

![](https://www.google.com/s2/favicons?domain=https://nextjs.org\&sz=32)

Next.js

+2

You can also colocate tests next to a feature when that makes its behaviour easier to understand. The `tests/` directory is particularly useful for end-to-end flows and cross-feature integration tests.

## 8. The rules I would enforce on the team

These are more important than the exact number of directories.

1. Pages orchestrate; features implement. Avoid putting large components, application logic, and multiple API calls directly into `page.tsx`.

2. Features own their domain. Do not import a feature's internal files from another feature indiscriminately. Expose a deliberately small public API when cross-feature reuse is necessary.

3. Shared means genuinely shared. Do not put a component into `components/ui/` just because it is reusable once.

4. Keep Server and Client Components deliberate. Do not make the entire application client-rendered just to support an interactive agent.

5. Validate boundaries. Validate external API responses and user inputs where trust boundaries require it; TypeScript types alone do not validate runtime data.

6. Do not duplicate backend behaviour in React. Agent execution, repository permissions, and simulation operations should remain authoritative on the backend.

7. Avoid speculative abstractions. Build for the features Jetic has now, and extract interfaces or shared modules when real repetition or complexity appears.

## 9. How I would implement it

Start by setting up the App Router and its two primary experiences: the public landing site and the authenticated product shell. Then establish the shared design system, typed API boundary, authentication flow, and workspace model. Build repository connection next, followed by the simulation feature and the agent experience that coordinates those operations.

This is a better starting point than building dozens of empty abstraction folders before any real workflow exists.

My recommendation: use this feature-oriented structure as Jetic's architectural baseline, but keep the main landing page, documentation, and actual developer workspace independently organised. The landing page should be optimised for explaining and demonstrating Jetic; the authenticated application should be optimised for helping a developer get work done.
