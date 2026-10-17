# Jetic CLI: Research, Command Catalog, and Product Specification

**Status:** Product/engineering proposal, not a claim that every command is implemented  
**Research snapshot:** 17 October 2026  
**Product:** Jetic — code-aware, agent-powered API behavior testing, workflow execution, and workload simulation  
**Primary principle:** The CLI is the local execution engine. The web app is the control plane. Agents plan and refine tests, but a deterministic runtime validates, executes, measures, and records the evidence.

---

## 1. Executive recommendation

Jetic should not position itself as “Postman plus an LLM” or as a thin wrapper around k6. Those products already cover important parts of API testing and load generation. A stronger direction is:

> **Jetic understands how an application is built, discovers how its API is supposed to behave, generates stateful test plans, runs them reproducibly, simulates real workflows and workload, and gives every coding agent a safe, machine-readable way to verify its work.**

The product's distinctive loop should be:

1. **Understand the code and runtime.** Discover routes, middleware, schemas, data relationships, integrations, route-to-source provenance, and existing tests.
2. **Build a versioned API model.** Represent endpoints, request/response schemas, identity/role requirements, dependencies between operations, and evidence/source confidence separately—not in one unbounded JSON blob.
3. **Plan tests with evidence.** Combine deterministic generators and an agent planner. The planner can propose scenarios, but it must cite model nodes, source locations, observed traces, or declared business rules for its reasoning.
4. **Execute in a controlled engine.** Run workflows, contract tests, negative tests, authorization matrices, fuzzing, replay, and load scenarios without letting the agent invent a hidden execution path.
5. **Measure the outcome.** Record each request, captured variable, assertion, state transition, resource measurement, and failure reason in a durable trace.
6. **Refine, verify, and replay.** An agent can propose a follow-up test or a code fix, but Jetic reruns the same test suite against the new commit and compares the evidence.

The differentiator is not “more requests.” It is **better test selection, deeper stateful exploration, trustworthy evidence, safe simulation, reproducibility, and an excellent agent interface**.

### Important positioning decision

Do not promise that Jetic “replaces k6 and Postman” on day one. Compete by making a single workflow much smarter: scan a real codebase, learn that a checkout needs authentication/cart/payment/webhook state, run the entire journey, test boundaries and abuse cases, measure performance, and produce a report that both a developer and a coding agent can act on. Then expand compatibility and scale.

---

## 2. Repository and current-command audit: what is verified versus proposed

From the Jetic context available for this specification, the following current CLI commands are known:

| Command | Known behavior | Confidence/status |
|---|---|---|
| `jetic scan` | Scans a Node.js repository and builds/updates Jetic's API/project model. Earlier project context described a generated `model.json`. | Existing command known from prior Jetic context; exact current flags and implementation must be checked against the current repo. |
| `jetic dev` | Starts the local development dashboard/studio, previously described at `localhost:8877`, with the longer-term idea of watching files and incrementally syncing changes. | Existing command known from prior Jetic context; exact current flags and watcher behavior must be checked against the current repo. |

A public npm listing for `jetic-cli` is discoverable, but the exact GitHub repository URL and its source tree were not available in the visible conversation material, and the hosted repository could not be verified from the public links discoverable in this research pass. **Therefore, this document does not falsely label the proposed catalog below as already implemented.** It provides a target command contract and a migration path.

Before implementation, run these against the repo that is actually checked out and preserve their output in `docs/research/current-cli-inventory.md`:

```bash
jetic --help
jetic --version
jetic scan --help
jetic dev --help
```

If the published binary name differs from the package name, use the actual `bin` entry in `package.json`. Also inspect `package.json`, the CLI dispatcher, command modules, tests, and the most recent release tag. The repository audit must report **implemented / partial / absent / deprecated** for each feature in this spec.

### Ground rules for command evolution

- Keep `jetic scan` and `jetic dev` working unless a deliberate migration is necessary.
- Don't ship every command in this document at once. Many entries are target-state capabilities.
- Every implemented command must have `--help`, deterministic exit codes, structured output, cancellation support when long-running, and tests.
- Preserve the human CLI, but treat machine mode as a first-class contract rather than scraping terminal text.

---

## 3. Lessons from the current tool landscape

### 3.1 k6: adopt explicit workload models and measurable thresholds

Grafana k6 models traffic through named scenarios and executor schedules; its scenarios can run in parallel or be arranged to appear sequentially, and thresholds make a run pass/fail against service-level objectives. Its browser module also supports browser-level tests alongside protocol-level scripts. These are mature concepts worth adopting: [k6 scenarios](https://grafana.com/docs/k6/latest/using-k6/scenarios/), [thresholds](https://grafana.com/docs/k6/latest/using-k6/thresholds/), [browser testing](https://grafana.com/docs/k6/latest/using-k6-browser/running-browser-tests/).

**Jetic opportunity:** let users describe a business journey once, then compile it into functional checks, a controlled workload, and a set of assertions. Don't implement a separate one-off DSL for each testing mode.

### 3.2 Postman CLI: keep collections portable and CI-friendly

Postman's CLI can run collections locally and in CI/CD. Its current docs also describe importing from cURL/HAR, linting collection formats, migrating collection formats, and sending results to the cloud when configured: [Postman CLI collection docs](https://learning.postman.com/docs/postman-cli/postman-cli-collections), [run a collection](https://learning.postman.com/docs/postman-cli/postman-cli-run-collection).

**Jetic opportunity:** provide import/export adapters for OpenAPI, Postman collections, cURL, HAR, and Jetic-native workflows so adoption doesn't require a full rewrite. Keep the core model vendor-neutral.

### 3.3 Schemathesis: stateful and schema-guided testing should be first-class

Schemathesis runs test phases covering examples, coverage, fuzzing, and stateful exploration. It supports reproducible seeds, bounded examples, continuing after individual failures, and time-bounded continuous fuzzing. It can order operations based on declared links and API semantics: [CLI tutorial](https://schemathesis.readthedocs.io/en/stable/tutorials/cli/), [CLI reference](https://schemathesis.github.io/schemathesis/reference/cli/), [continuous fuzzing](https://schemathesis.readthedocs.io/en/stable/guides/continuous-fuzzing/).

**Jetic opportunity:** couple schema fuzzing to source-derived knowledge, observed runtime behavior, role/identity profiles, and multi-step workflows. Use shrinking/minimization so a failed long sequence becomes a short replayable reproducer.

### 3.4 Arazzo: workflows need a portable document format

The OpenAPI Initiative's Arazzo Specification 1.1.0 describes machine-readable sequences of API calls and their dependencies in pursuit of an outcome. It is intended to work in the context of API descriptions such as OpenAPI and AsyncAPI: [Arazzo 1.1.0](https://spec.openapis.org/arazzo/latest.html), [OpenAPI Initiative overview](https://www.openapis.org/arazzo-specification).

**Jetic opportunity:** support Arazzo import/export where feasible, while defining a Jetic extension for features Arazzo doesn't model directly (agent evidence, load profiles, data fixtures, authorization identities, environment policies, trace references, and safety constraints). Don't invent a proprietary format for basic API call sequencing when an open standard already helps.

### 3.5 Keploy: traffic recording and replay create useful regression tests

Keploy's CLI supports recording API interactions, testing recorded cases, rerecording, sanitizing, and reporting: [Keploy CLI reference](https://keploy.io/docs/running-keploy/cli-commands/).

**Jetic opportunity:** use observed traffic as one source of test evidence, but don't blindly treat recordings as truth. Convert recordings into parameterized, secret-scrubbed, assertion-backed workflows and label which behaviors were observed rather than guaranteed.

### 3.6 API security: test permissions and business rules, not only HTTP status codes

The OWASP API Security Top 10 (2023) includes broken object-level authorization, broken authentication, broken object-property authorization, unrestricted resource consumption, broken function-level authorization, abuse of sensitive business flows, SSRF, misconfiguration, inventory problems, and unsafe consumption of other APIs: [OWASP risk list](https://api-security.owasp.org/editions/2023/en/0x11-t10/).

**Jetic opportunity:** provide safe, bounded, identity-aware test templates for these risk classes. A test should not simply send an unusual payload and celebrate a 500; it should state a hypothesis, establish the expected invariant, gather evidence, and reduce the case to a reproducible failure.

### 3.7 Structured telemetry should make run evidence portable

OpenTelemetry defines shared conventions for HTTP spans, metrics, and exceptions: [HTTP semantic conventions](https://opentelemetry.io/docs/specs/semconv/http/), [HTTP metrics](https://opentelemetry.io/docs/specs/semconv/http/http-metrics/). RFC 9457 defines a standard machine-readable format for HTTP API problem details: [RFC 9457](https://www.rfc-editor.org/info/rfc9457/).

**Jetic opportunity:** use stable internal event names, OpenTelemetry-compatible metrics, trace/correlation IDs, and clear API error classification. The report must distinguish an assertion failure from a network fault, runner overload, unsupported test, or inconclusive observation.

### 3.8 Agent tools need narrow schemas and safety boundaries

The MCP specification describes tools as discoverable, schema-defined capabilities. It recommends validation, access controls, rate limits, sanitized outputs, timeouts, auditability, and human confirmation for sensitive operations: [MCP tools spec](https://github.com/modelcontextprotocol/modelcontextprotocol/blob/main/docs/specification/2026-07-28/server/tools.mdx), [MCP authorization security considerations](https://github.com/modelcontextprotocol/modelcontextprotocol/blob/main/docs/specification/2026-07-28/basic/authorization/security-considerations.mdx).

**Jetic opportunity:** expose typed high-level tools such as `scan_project`, `list_endpoints`, `plan_tests`, `run_workflow`, and `inspect_run`—not an unrestricted shell and not a generic “send any request anywhere” tool by default.

---

## 4. The target CLI experience

### 4.1 Happy path

The first-run experience should be this small:

```bash
npx jetic-cli init
jetic scan
jetic model status
jetic test generate --profile baseline
jetic test run --suite baseline
jetic report open latest
```

For a running local API, the CLI should either accept the target URL explicitly or detect an application command configured in the project. It must not quietly assume that a source-code scan means the app can be executed or that the app is safe to mutate.

### 4.2 Full workflow example

```bash
# 1. Initialize a local Jetic project and choose safe defaults.
jetic init

# 2. Build/update the repository model.
jetic scan --watch

# 3. Review new endpoints, route provenance, and model changes.
jetic model status
jetic model diff --base HEAD~1 --head HEAD

# 4. Generate deterministic baseline, contract, and stateful tests.
jetic test generate --profile baseline --from model
jetic test generate --profile stateful --from model

# 5. Validate and run the checkout workflow on a known test environment.
jetic workflow validate checkout
jetic workflow run checkout --env local-test --seed 481516

# 6. Exercise bounded negative cases and authorization rules.
jetic security run --profile api-baseline --env local-test --policy .jetic/safety.yaml

# 7. Run a low-impact performance smoke test with explicit budgets.
jetic simulate run checkout-smoke --env staging --profile .jetic/simulations/smoke.yaml

# 8. Inspect, export, and share machine-readable evidence.
jetic report show latest
jetic report export latest --format json --out artifacts/jetic-report.json
jetic report export latest --format junit --out artifacts/junit.xml
```

The exact subcommands are proposals. They establish consistent nouns and verbs rather than prescribing today's implementation.

---

## 5. Proposed complete command catalog

### Command status notation

- **Known today:** only the existing commands confirmed from prior Jetic context (`scan` and `dev`).
- **P0 / MVP:** the smallest practical CLI needed for a reliable end-to-end product.
- **P1 / Expansion:** useful after the basic scan → plan → execute → report loop works.
- **P2 / Advanced:** valuable, but not a reason to delay the MVP.

Global options should work consistently wherever they make sense:

```text
--json                 Machine-readable JSON output
--format <format>      cli | json | jsonl | junit | sarif | html | markdown
--project <path>       Project root or Jetic project path
--env <name>           Named environment
--timeout <duration>   Command or operation deadline
--seed <integer>       Deterministic random seed
--no-color             Disable ANSI formatting
--quiet                Suppress non-essential output
--verbose              Diagnostic logging to stderr
--debug                More detailed local diagnostics; redact secrets
--yes                  Approve only safe, pre-authorized non-destructive prompts
--dry-run              Show planned actions without sending requests or changing files
```

Not every option belongs on every command. Command schemas must reject contradictory flags and explicitly state which options are unavailable.

### 5.1 Root, project, configuration, and diagnostics

| Command | Priority | Purpose and behavior |
|---|---|---|
| `jetic --help` | P0 | Print the command tree, global options, and examples. Must be generated from the same schemas used by the parser. |
| `jetic --version` | P0 | Print CLI version, model schema version, engine protocol version, and optional build commit in JSON mode. |
| `jetic init` | P0 | Create `.jetic/`, baseline config, ignore file, project identifier, empty model index, and optional example workflow. Detect existing files and avoid overwriting them without explicit approval. |
| `jetic doctor` | P0 | Check Node/runtime compatibility, repository root, config validity, permissions, app reachability if a target is configured, optional integrations, browser/runtime availability, and network policy. Print actionable fixes, not only pass/fail. |
| `jetic config show` | P0 | Print effective non-secret configuration with provenance (default, file, environment variable, CLI flag). Secret values must never be printed. |
| `jetic config get <key>` | P0 | Retrieve one effective non-secret config field. Reject secret paths or return only `configured: true/false`. |
| `jetic config set <key> <value>` | P0 | Change a schema-validated setting; show a diff first in interactive mode. Don't use free-form shell evaluation for values. |
| `jetic config validate` | P0 | Validate config and report unknown keys, invalid ranges, missing required fields, and deprecated settings. |
| `jetic config path` | P1 | Print the resolved config and data directories for scripts and support. |
| `jetic doctor --json` | P0 | Produce stable diagnostics objects suitable for issue templates and agent triage. |
| `jetic clean` | P1 | Remove only explicitly selected caches/artifacts; never delete source, secrets, test evidence, or persistent run history without a separate confirmation. |
| `jetic update` | P2 | Check/show/update CLI versions if the package distribution supports this safely. In CI, default to check-only. |

### 5.2 Local Studio and watch mode

| Command | Priority | Purpose and behavior |
|---|---|---|
| `jetic dev` **(known today)** | Known | Start the local Studio/dashboard. Keep backward compatibility. Exact current options must be verified from source. |
| `jetic dev --port <n>` | P0 | Choose a local port; bind to loopback by default, not `0.0.0.0`. |
| `jetic dev --no-open` | P0 | Avoid launching a browser in CI, containers, or remote terminals. |
| `jetic dev --watch` | P0 | Watch supported source/config files, debounce file events, re-index only affected modules, and report changed files/endpoints. It should not unexpectedly re-run destructive tests. |
| `jetic dev --jsonl` | P1 | Emit structured lifecycle events for a wrapper process. Web clients should connect to an explicit local API/event stream rather than scrape the terminal. |
| `jetic dev status` | P1 | Report whether local Studio is active, its loopback URL, protocol version, and health—not authentication cookies or secrets. |
| `jetic dev stop` | P1 | Stop only the Jetic-owned local process identified by a PID/lock record; don't kill arbitrary processes using the port. |

**Implementation details:** use a lock/PID file, a unique per-launch local token, safe browser-origin checks, and clear shutdown handling. Never make a local unauthenticated server listen on all interfaces. For remote web orchestration, use an authenticated runner tunnel or outbound connection rather than exposing a random local port to the internet.

### 5.3 Repository scan and project model

| Command | Priority | Purpose and behavior |
|---|---|---|
| `jetic scan` **(known today)** | Known | Scan the repository and create/update the API model. Current context referenced `model.json`; migrate carefully to a versioned model directory without breaking existing users. |
| `jetic scan --watch` | P0 | Perform an initial full scan, then incremental scans as relevant files change. Emit added/changed/removed symbols and routes with stable IDs. |
| `jetic scan --full` | P0 | Force a clean full scan and compare it with the prior model. |
| `jetic scan --scope <path/glob>` | P1 | Scan a selected subtree while preserving dependency references outside the scope. |
| `jetic scan --framework <name>` | P1 | Force or limit framework adapters; automatic detection remains default. |
| `jetic scan --strict` | P0 | Fail if required metadata is incomplete (for example unsupported routing patterns or schema parse errors). |
| `jetic scan --baseline <ref>` | P1 | Compare current model with a Git commit/branch and report endpoint changes. |
| `jetic scan --json` | P0 | Return model counts, scan warnings, source evidence, and change summary as JSON. |
| `jetic model status` | P0 | Show model version, model schema version, source commit, last scan time, route count, unknowns, and staleness. |
| `jetic model list` | P0 | List services, endpoints, workflows, schemas, evidence links, and stable IDs with filters. |
| `jetic model show <id>` | P0 | Show the full endpoint/service/schema record and code provenance. |
| `jetic model diff [--base <ref>] [--head <ref>]` | P0 | Explain endpoint additions/removals, parameter/schema changes, auth changes, middleware changes, and confidence changes. |
| `jetic model validate` | P0 | Verify graph references, unique IDs, schema validity, route collisions, unresolved dependencies, and migration compatibility. |
| `jetic model export --format <format>` | P0 | Export OpenAPI JSON/YAML, Jetic model JSON, or supported interchange formats. Clearly distinguish inferred from authoritative contract fields. |
| `jetic model import <file>` | P0 | Import OpenAPI, Postman, or Jetic model data; validate first and show conflict/merge decisions. |
| `jetic model sync` | P1 | Synchronize local model and remote workspace using version numbers and explicit conflict resolution. |
| `jetic model history` | P1 | List model snapshots and the run/source commit that produced them. |
| `jetic model annotate <id>` | P1 | Add a human-owned assertion, business rule, route classification, or confidence override without mutating scanner-generated facts. |

#### Scanner requirements

The scanner should be an adapter-driven pipeline, not a single giant prompt:

1. **Repository inventory:** identify runtime, package manager, framework, source roots, tests, lockfiles, build scripts, Docker/Compose files, and existing OpenAPI specs.
2. **Static route discovery:** use AST parsers and framework adapters for Express, Fastify, NestJS, Hono, Next.js route handlers, and other targets only after test fixtures exist. Record source file/line and the evidence type for every route.
3. **Schema and validation discovery:** identify path/query/header/body parameters, runtime validators, DTOs, response serializers, declared return types, auth middleware, and error handlers when reliable.
4. **Dependency graph:** link handlers to validation, auth, services, repositories, and outbound integrations. Distinguish a detected reference from a proven runtime dependency.
5. **Dynamic evidence:** optionally run an approved local server and observe routes, status codes, timing, and sanitized traffic. Dynamic discovery must be opt-in for state-changing methods.
6. **Confidence and unknowns:** each field gets `source`, `observed`, `declared`, `inferred`, or `unknown` provenance and a confidence value/reason. Never silently turn model guesses into verified API contracts.
7. **Incremental invalidation:** map changed files to route/model graph nodes. A scan must be able to invalidate dependencies, not merely re-read the changed file and leave stale dependent models.

### 5.4 Environments, auth profiles, variables, and secrets

| Command | Priority | Purpose and behavior |
|---|---|---|
| `jetic env list` | P0 | List configured environments with base URL, labels, target authorization status, and secret-presence metadata only. |
| `jetic env show <name>` | P0 | Display safe configuration with each value's source and override precedence. Mask secret values. |
| `jetic env create <name>` | P0 | Create an environment for local, CI, staging, or a dedicated sandbox. Require a safety policy for non-local targets. |
| `jetic env use <name>` | P0 | Choose the default environment locally without changing secret contents. |
| `jetic env set <name> KEY=VALUE` | P0 | Set a non-secret variable, validate its name, and show the diff. |
| `jetic env secret set <name> KEY` | P0 | Read a secret from hidden interactive input or stdin. Never accept secrets as command-line arguments where shell history/process listings can expose them. |
| `jetic env secret status <name>` | P0 | Show which keys are configured, never their values. |
| `jetic env validate <name>` | P0 | Check required variables, base URL policy, TLS requirements, credentials reachability where safe, and target allowlist. |
| `jetic auth list` | P0 | List named auth profiles such as anonymous, user, admin, and service account. Credentials are never displayed. |
| `jetic auth create <profile>` | P1 | Create an auth profile definition and credential acquisition strategy. |
| `jetic auth test <profile>` | P1 | Verify credentials with a configured safe health/profile request; avoid login brute force or exposing tokens. |
| `jetic auth revoke <profile>` | P1 | Remove local credential material and optionally request remote revocation if supported. |

**Secret strategy:** store local secrets in the OS credential store when feasible, or an encrypted local vault with a separate key; don't commit them. In cloud workspaces store encrypted values separately from ordinary variables, use write-only APIs, and only inject credentials into the runner. The scanner, model, test fixtures, LLM context, logs, and report artifacts must never contain raw tokens or passwords.

### 5.5 Test definition and generation

| Command | Priority | Purpose and behavior |
|---|---|---|
| `jetic test list` | P0 | List tests/suites, tags, origin, status, last run, and model version. |
| `jetic test generate --profile <profile>` | P0 | Generate candidate tests from the API model using deterministic rules first and optional AI planning second. Save them as reviewable test definitions, not ephemeral prompt output. |
| `jetic test generate --from <source>` | P0 | Sources: model, OpenAPI, recorded traffic, code change, or a workflow. Clearly identify each source. |
| `jetic test generate --only <pattern>` | P0 | Limit generation by endpoint, route group, tag, or source path. |
| `jetic test generate --dry-run` | P0 | Show proposed cases, request budgets, state mutations, and missing inputs without sending any requests. |
| `jetic test validate <file-or-suite>` | P0 | Validate DSL/schema, referenced endpoints, captures, assertions, environment variables, and safety policy. |
| `jetic test run [suite]` | P0 | Execute tests and produce a durable run, per-step result, traces, and machine-readable exit status. |
| `jetic test replay <run-id>` | P0 | Replay a specific failing case from recorded request inputs and seed. It must not replay credential values that have expired; ask for the required auth profile again. |
| `jetic test explain <test-id>` | P1 | Explain why a test exists and what source/model/business rule supports it. |
| `jetic test promote <candidate-id>` | P1 | Promote a validated discovered case into a stable regression suite after review. |
| `jetic test quarantine <test-id>` | P1 | Temporarily isolate flaky tests with an owner, reason, and expiry; never silently ignore them. |
| `jetic test minimize <run-id>` | P1 | Reduce a failing generated input/workflow while preserving the failure. Store original and minimized cases. |
| `jetic test diff <run-a> <run-b>` | P1 | Compare statuses, assertions, timing distributions, response shapes, and trace differences. |
| `jetic test export --format <format>` | P1 | Export JSON/JUnit or supported formats for CI, or an adapter format such as Postman. |

#### Required test profiles

Profiles are named policies, not hidden magic levels:

- `baseline`: health, happy-path parameter coverage, contract validation, expected errors, no destructive abuse.
- `boundary`: min/max lengths and values, empty/missing/null, numeric bounds, enums, date formats, pagination boundaries, encoding, repeated parameters.
- `negative`: malformed or invalid inputs expected to produce documented 4xx responses, not accidental 5xx or timeouts.
- `stateful`: dependency-aware sequences with create/read/update/delete and captured identifiers.
- `authz`: role/identity matrix and access-control invariants.
- `business`: declared business rules such as no duplicate payment, no refund above captured amount, no order transition from cancelled to paid.
- `resilience`: timeouts, controlled dependency failures, retry handling, idempotency, webhook replay, and partial failures in an isolated environment.
- `performance-smoke`: low-load latency/error baseline and thresholds.
- `security-baseline`: safe, bounded API security tests aligned to the OWASP API risks.
- `deep-exploration`: budget-limited stateful generation, fuzzing, shrinking, and agent-proposed follow-up cases.

A profile must say what it will do before execution, including target, maximum request count, concurrency, wall-clock duration, maximum response body size, and potential state mutation.

### 5.6 Test execution, run management, and inspection

| Command | Priority | Purpose and behavior |
|---|---|---|
| `jetic run <suite-or-workflow>` | P0 | Convenient alias for executing a validated test suite/workflow with the configured runner. It should resolve to a durable run ID. |
| `jetic run status <run-id>` | P0 | Read queued/running/complete/failed/cancelled state, progress, and last safe event. |
| `jetic run list` | P0 | List recent runs by project, environment, suite, status, commit, and time range. |
| `jetic run inspect <run-id>` | P0 | Show step-level timeline, request IDs, assertion outcomes, variable captures (redacted), and classified failure causes. |
| `jetic run logs <run-id>` | P0 | Stream safe structured run events; secrets and raw PII are redacted by default. |
| `jetic run cancel <run-id>` | P0 | Cancel the test generator and in-flight requests, stop new work, close sockets, and mark unfinished steps as cancelled. |
| `jetic run retry <run-id>` | P1 | Retry failed steps only where idempotent and semantically safe. Default to replaying the whole case with the same seed, not blindly retrying mutations. |
| `jetic run artifacts <run-id>` | P0 | List reports, traces, request/response samples, minimized reproducers, and checksums with safe paths/links. |
| `jetic run export <run-id>` | P0 | Export normalized results in JSON, JSONL, JUnit, SARIF where applicable, or Markdown/HTML. |
| `jetic run compare <run-a> <run-b>` | P1 | Compare behavior between branches/environments or before/after a fix. Normalize dynamic fields before comparing bodies. |

### 5.7 Workflows and scenario graphs

| Command | Priority | Purpose and behavior |
|---|---|---|
| `jetic workflow list` | P0 | List workflows with goal, version, endpoints used, tags, and validation state. |
| `jetic workflow new <name>` | P0 | Create a workflow skeleton from selected endpoints or from a supported Arazzo/OpenAPI flow. |
| `jetic workflow show <name>` | P0 | Print steps, dependencies, inputs, captures, assertions, branches, cleanup, and safe-state effects. |
| `jetic workflow validate <name>` | P0 | Validate step types, variable scope, dependency edges, unreachable steps, cycles, branch completeness, retry policy, and cleanup requirements. |
| `jetic workflow compile <name>` | P0 | Compile the declarative workflow to a versioned execution plan with dependencies and bounded retry semantics. |
| `jetic workflow run <name>` | P0 | Execute sequentially or with explicit parallel groups; capture response values into typed workflow memory. |
| `jetic workflow replay <run-id>` | P0 | Replay the same workflow from captured non-secret inputs and seed, with required auth refreshed. |
| `jetic workflow record` | P1 | Observe explicitly approved traffic and convert it to a draft workflow. Redact secrets and mark unverified assertions. |
| `jetic workflow import <file>` | P1 | Import Arazzo, Jetic, or supported vendor workflows. Validate and explain unsupported features. |
| `jetic workflow export <name> --format arazzo` | P1 | Export the portable subset to Arazzo; report any Jetic-only features that cannot be represented. |
| `jetic workflow diff <name> --base <ref>` | P1 | Compare workflow versions, request dependencies, assertions, and model references. |
| `jetic workflow debug <run-id>` | P1 | Replay with breakpoints, inspect step input/captured variables, and resume from a known checkpoint where safe. |

#### Workflow runtime contract

Each step must have a typed kind, stable ID, explicit input mapping, timeout, retry/continue behavior, and expected outputs. Useful step types include:

- `http.request`: a request against a model endpoint.
- `assert`: status, header, JSON path, schema, latency, count, or business-invariant assertion.
- `capture`: extract a typed value from a response/header/cookie into workflow memory.
- `branch`: deterministic condition against known variables/assertions.
- `loop`: bounded iteration with explicit maximum count and deadline.
- `wait`: bounded wait for a resource/event; poll with backoff and deadline.
- `webhook.wait`: wait for a signed callback received by an approved test receiver.
- `fixture.create` / `fixture.cleanup`: create/delete test-owned data using declared adapters.
- `parallel`: run independent branches with isolated state and bounded concurrency.
- `fault.inject`: allowed only inside an explicitly isolated simulation environment.
- `agent.propose`: ask a configured planner to propose a follow-up, but do not let this step make unreviewed arbitrary network calls.

The deterministic engine—not the language model—owns variable binding, step order, retries, request execution, cancellation, assertions, and persistence.

### 5.8 Simulation and load testing

Jetic should define **simulation** as a set of user/workload behaviors executed against a declared target under explicit budgets. It is broader than sending concurrent HTTP requests.

| Command | Priority | Purpose and behavior |
|---|---|---|
| `jetic simulate list` | P1 | List named simulation definitions, workloads, target environments, and safety limits. |
| `jetic simulate new <name>` | P1 | Create a scenario from a workflow, then choose workload shapes and stop conditions. |
| `jetic simulate validate <name>` | P1 | Validate workload math, environment authorization, target limits, data isolation, thresholds, and cleanup. |
| `jetic simulate plan <name>` | P1 | Compile a no-traffic execution plan showing ramp, virtual users, duration, requests/second ceiling, data creation, runner requirements, and estimated budget. |
| `jetic simulate run <name>` | P1 | Execute a load profile on an approved target. Must enforce global and local rate limits and abort conditions. |
| `jetic simulate status <run-id>` | P1 | Display users/iterations started, throughput, latency quantiles, error rate, current phase, and threshold state. |
| `jetic simulate stop <run-id>` | P1 | Immediately stop new iterations and drain/cancel active requests according to the scenario's stop policy. |
| `jetic simulate report <run-id>` | P1 | Produce load report, time series, threshold results, target/runner capacity metadata, and caveats. |
| `jetic simulate compare <run-a> <run-b>` | P1 | Compare revisions/configurations with matched workloads and environment metadata. |
| `jetic simulate calibrate <profile>` | P2 | Calibrate safe runner capacity on an isolated known target to estimate whether the load generator—not the system under test—is the bottleneck. |
| `jetic capacity plan` | P2 | Use measured runs and deployment telemetry to estimate a safe capacity envelope under explicit assumptions. This cannot infer reliable maximum users from a server price alone. |
| `jetic chaos plan/run` | P2 | Apply bounded, reversible failures (latency, timeouts, dependency outage, webhook delay) in a sandbox or controlled staging environment with rollback. |

#### Workload models

Support a small set of understandable workload profiles first:

- `constant-vus`: maintain a fixed number of concurrent virtual users.
- `ramp-vus`: ramp users in stages.
- `arrival-rate`: schedule iterations at a target arrival rate; monitor dropped iterations.
- `spike`: brief, bounded increase under a hard traffic ceiling.
- `soak`: low/medium load for a longer period to observe degradation/leaks.
- `mixed-journeys`: multiple workflows with weighted proportions (for example browse 60%, checkout 25%, refund/status 15%), where all mutation-bearing steps use isolated test identities/data.
- `replay`: replay a sanitized traffic distribution with caps and deduplication safeguards.

Every simulation needs a workload seed, max duration, max requests, max concurrency, per-endpoint ceilings, timeout, error/latency thresholds, abort policy, and test-data cleanup plan. Never use an unrestricted unbounded loop.

#### Performance metrics

At minimum capture:

- request rate and completed iteration rate;
- active virtual users and dropped iterations;
- total requests, success/error counts, timeouts, connection failures;
- latency p50, p90, p95, p99, max, and per-endpoint distribution;
- response sizes and transferred bytes;
- threshold outcomes over time;
- runner CPU/memory/event-loop lag and network saturation where measurable;
- target-side metrics if the customer provides access/telemetry;
- build commit, environment, deployment version, region, run seed, and workload profile.

**Do not present “estimated max users” as a fact.** Provide the observed tested load, where degradation started, which constraint was measured, and a confidence band/assumption ledger. A $10 server budget does not uniquely determine capacity: runtime, database, network, caching, query shape, region, limits, and the load generator all matter.

### 5.9 Security, boundary, authorization, and abuse-resistance tests

The goal is authorized defensive verification. Dangerous tests must be bounded and limited to assets the user owns or is explicitly authorized to test.

| Command | Priority | Purpose and behavior |
|---|---|---|
| `jetic security list` | P1 | List security test profiles and what each profile may send. |
| `jetic security plan --profile <name>` | P1 | Produce the planned cases, target, identities, request ceilings, and possible state changes without execution. |
| `jetic security run --profile api-baseline` | P1 | Run safe checks across the OWASP API risk categories that can be responsibly verified in the configured environment. |
| `jetic authz plan` | P1 | Build an authorization matrix from available roles, auth profiles, and sensitive endpoints. Identify unknown roles/ownership semantics. |
| `jetic authz run` | P1 | Use test fixtures/known principals to validate access boundaries and property-level restrictions. |
| `jetic boundary run` | P1 | Run scalar, collection, pagination, encoding, missing/null, repeated-key, and content-type boundaries. |
| `jetic abuse plan` | P1 | Identify business flows that may be abused (duplicate actions, repeated OTP/payment/email triggers, bulk APIs, high-value operations) and show safe tests/limits. |
| `jetic abuse run --profile safe` | P1 | Execute low-rate, capped tests of idempotency, quotas, rate-limit headers, deduplication, and business invariants. Never run password/OTP brute force or unbounded resource-exhaustion patterns. |
| `jetic security baseline` | P1 | Save a baseline report and let CI detect regressions. |
| `jetic security export --format sarif` | P1 | Export source-linked findings to SARIF when the finding has defensible source location or security semantics. |

#### What “deep testing” should actually mean

For a login route, a shallow test says “POST invalid password; expect 401.” A deeper Jetic test should cover the **invariant** and relevant surrounding state:

- valid login creates the expected session/auth context;
- invalid credentials return a documented error without exposing account existence;
- expired, malformed, wrong-audience, or revoked credentials are rejected;
- session rotation, cookie flags, refresh-token reuse, and logout/revocation behave as intended where applicable;
- repeated attempts obey configured rate limits, with a tiny controlled sample only in a test environment;
- a user cannot access another user's object by changing an identifier;
- role/tenant boundaries hold across related read/write endpoints;
- returned properties are authorized, and mass assignment cannot modify server-controlled fields;
- duplicate/idempotent operations do not double-charge, double-create, or double-trigger external side effects;
- test data is isolated per identity, and cleanup is checked;
- the trace links each assertion to the request, identity profile, source evidence, and result.

Jetic should test business abuse **without implementing denial-of-service behavior**. Default security profiles should enforce a very low request budget and avoid causing provider costs. Higher-risk tests require a separate explicit policy and a target environment marked as authorized.

### 5.10 Traffic capture, recording, mocks, and fixtures

| Command | Priority | Purpose and behavior |
|---|---|---|
| `jetic record start` | P1 | Start an approved local proxy/recorder and capture requests with secret redaction. Clearly disclose whether TLS interception is required. |
| `jetic record stop` | P1 | Finalize capture and write an immutable raw/normalized recording pair, subject to retention policy. |
| `jetic record convert <file>` | P1 | Convert a recording into draft Jetic workflows/tests. Don't treat one observed response as a guaranteed assertion. |
| `jetic mock generate` | P1 | Generate contract-based mocks or dependency adapters for repeatable workflows. |
| `jetic mock serve` | P1 | Start a local mock server bound to loopback unless explicitly reconfigured. |
| `jetic fixture generate <schema>` | P1 | Generate valid/invalid synthetic data with recorded seed and privacy-safe defaults. |
| `jetic fixture load <dataset>` | P1 | Load only into approved disposable/test data stores; require explicit target declaration. |
| `jetic fixture cleanup <run-id>` | P1 | Delete Jetic-owned test data using provenance tags and verify cleanup. |
| `jetic webhook receive` | P2 | Start a local/test receiver for signed webhook assertions; use replay protection and bounded retention. |
| `jetic proxy inspect` | P2 | Display currently observed endpoints/traffic metadata without dumping secrets or raw bodies by default. |

### 5.11 Reporting and outputs

| Command | Priority | Purpose and behavior |
|---|---|---|
| `jetic report show [run-id]` | P0 | Show high-level outcome, coverage, failed assertions, latency thresholds, run environment, and trace links. |
| `jetic report open [run-id]` | P0 | Open the Studio view for a run; fail gracefully when no Studio is running. |
| `jetic report export <run-id> --format json` | P0 | Export a stable machine-readable result schema. |
| `jetic report export <run-id> --format junit` | P0 | Export test results for common CI systems. Preserve individual testcase identity. |
| `jetic report export <run-id> --format sarif` | P1 | Export source-linked code/security findings when supported. |
| `jetic report compare <run-a> <run-b>` | P1 | Compare runs against thresholds and known flakiness. |
| `jetic report redact <run-id>` | P0 | Produce an explicitly redacted report/trace export. Raw artifacts should be access-controlled and retained according to policy. |
| `jetic report verify <artifact>` | P1 | Verify an artifact's schema version and checksum. |
| `jetic report publish <run-id>` | P1 | Upload a report to the user's configured workspace after authorization and redaction policy checks. |

### 5.12 Web platform and cloud workspace synchronization

These commands enable the website to orchestrate the local CLI without turning the CLI into an insecure remote shell.

| Command | Priority | Purpose and behavior |
|---|---|---|
| `jetic login` | P1 | Authenticate a user with browser/device flow. Don't put long-lived keys in command arguments or terminal logs. |
| `jetic logout` | P1 | Revoke/forget the local session and safely remove cached credentials. |
| `jetic workspace list` | P1 | List authorized workspaces. |
| `jetic workspace use <id>` | P1 | Select the workspace for the local project. |
| `jetic link` | P1 | Link the local repository/project to an existing cloud project using an explicit project identifier. |
| `jetic sync push` | P1 | Push permitted model/workflow/test definitions and metadata. Exclude secrets, raw traffic, and bulky traces by default. |
| `jetic sync pull` | P1 | Pull remote model/workflows/tests with version/conflict checks. Never silently overwrite local edits. |
| `jetic sync status` | P1 | Show local/server version numbers, pending operations, and conflicts. |
| `jetic agent serve` | P1 | Start an authenticated local agent bridge/JSON-RPC server for the web control plane, with a narrow method allowlist and explicit lifetime. |
| `jetic mcp serve` | P1 | Expose supported Jetic capabilities via an MCP server, initially stdio for local coding agents. HTTP mode requires authentication and secure transport. |
| `jetic mcp install <client>` | P2 | Generate/recommend client configuration for supported coding agents. Preview changes first; don't overwrite user config without approval. |
| `jetic webhooks test` | P2 | Send a test event to an authorized configured webhook destination with sanitized content. |

### 5.13 Extension and adapter ecosystem

| Command | Priority | Purpose and behavior |
|---|---|---|
| `jetic adapter list` | P1 | List installed framework, protocol, auth, fixture, and output adapters with compatibility versions. |
| `jetic adapter inspect <id>` | P1 | Show supported versions, capabilities, permissions, and limitations. |
| `jetic adapter validate <id>` | P1 | Validate adapter metadata and test fixtures in an isolated process. |
| `jetic plugin list` | P2 | List approved plugins. |
| `jetic plugin install <package>` | P2 | Install only signed/allowlisted packages or explicitly trusted packages; display requested permissions and network access. |
| `jetic plugin disable <id>` | P2 | Disable an extension without deleting its user data. |

Do not expose arbitrary plugin installation as an easy shortcut in the first MVP. A plugin can execute code in the same machine/process, so supply-chain and permission boundaries matter.

---

## 6. Agent integration: make any coding agent effective without making it omnipotent

### 6.1 Architecture: planner, engine, control plane

Use three distinct roles:

**A. Planner (agent/model)**
- Inspects compact model summaries, route provenance, change diffs, prior findings, and user-supplied business rules.
- Produces a typed `TestPlan`/`WorkflowDraft` with clear goals, assumptions, references, request budgets, and expected invariants.
- Can request refinement of a test, suggest a fixture, classify a failure, or propose a follow-up.
- Cannot override target policy, bypass allowlists, read secret values, decide that an unsafe run is authorized, or call arbitrary network endpoints outside the approved runner.

**B. Deterministic runtime (CLI engine)**
- Validates the plan against JSON Schema/Zod types, model version, environment policy, and execution budgets.
- Compiles a versioned plan and executes it.
- Owns HTTP calls, variable captures, workflow state, assertions, retry/idempotency, cancellation, fixture cleanup, result writes, and artifact redaction.
- Emits structured events and stable result objects that agents can interpret.

**C. Web control plane**
- Stores workspaces, model snapshots, workflows, policies, run metadata, annotations, agent sessions, and artifact metadata.
- Queues long-running work and tracks status/cancellation.
- Sends a job to an authorized local runner or managed runner.
- Displays evidence, permissions, and approval prompts. The web API never treats user-provided CLI output as trusted without schema validation.

This division prevents a language model from becoming the source of truth for what ran, what passed, which credentials were used, or whether the target was safe.

### 6.2 High-level tool surface

Expose a small tool API initially:

1. `jetic_project_status` — versions, scan status, and model counts.
2. `jetic_scan_project` — request a scan and return job ID/status.
3. `jetic_list_endpoints` — filter endpoints by service, method, tag, confidence, or source path.
4. `jetic_get_endpoint` — retrieve an endpoint's normalized schema, auth requirements, and provenance.
5. `jetic_get_model_diff` — summarize API/source changes since a ref/run.
6. `jetic_plan_tests` — ask the planner/runtime to produce candidate cases using a named profile and policy.
7. `jetic_validate_plan` — return typed validation diagnostics and safety-budget summary.
8. `jetic_run_suite` — run an already approved suite on a named environment. It must not accept arbitrary target URLs as an implicit override.
9. `jetic_run_workflow` — run a validated workflow against an approved environment.
10. `jetic_run_simulation` — requires an explicit workload profile, target approval, rate ceilings, and a permission gate.
11. `jetic_get_run_status` — fetch progress/status.
12. `jetic_inspect_run` — return sanitized trace summaries and failure classification.
13. `jetic_minimize_failure` — shrink a failing reproducible case within a bounded budget.
14. `jetic_compare_runs` — compare before/after evidence.
15. `jetic_propose_fix_context` — return relevant source locations and evidence for the agent to propose a code fix; Jetic should not silently patch source code by default.

Use JSON Schema for every tool's input and output. Include `projectId`, model version, environment, safety policy ID, request budget, and run correlation ID where relevant. Keep each tool narrowly scoped and separately permissioned.

### 6.3 Agent protocol and process model

- Provide **MCP over stdio** as the initial coding-agent path because it is local and easy to configure.
- Provide a **versioned JSONL/JSON-RPC bridge** for programmatic orchestration. Define request IDs, event sequence numbers, structured errors, cancellation, heartbeat, and protocol negotiation.
- Treat the CLI as a child process when the web app needs to drive it; capture stdout and stderr separately. `stdout` must contain only requested machine-readable payload in JSON mode; diagnostics go to `stderr`.
- For long jobs, return a job/run ID immediately and stream/poll progress events. Don't hold a single RPC open for a ten-minute scan or simulation.
- Make every event idempotent or sequence-numbered. A client reconnecting after a network drop must not duplicate a test run or lose completed results.
- Maintain protocol compatibility separately from product/schema versions. An agent should be able to ask which commands/capabilities the installed runner supports before planning.

Suggested protocol handshake:

```json
{
  "protocol": "jetic.runner.v1",
  "cliVersion": "0.x.y",
  "modelSchemaVersions": [1],
  "capabilities": [
    "scan.static.node",
    "workflow.sequential",
    "test.contract",
    "report.json",
    "run.cancel"
  ],
  "execution": {
    "local": true,
    "managed": false,
    "mcp": true
  }
}
```

Capabilities are feature flags discovered at runtime, not a hard-coded assumption that every runner has every adapter.

### 6.4 Agent loop that is grounded and repeatable

A good loop is:

```text
inspect project/model/diff
       ↓
create hypothesis-backed plan
       ↓
validate model references + budgets + target policy
       ↓
show plan/ask approval when policy requires it
       ↓
execute deterministic test plan
       ↓
persist requests, events, assertions, metrics and artifacts
       ↓
classify findings with evidence and confidence
       ↓
ask agent to propose minimal follow-up tests or code fix
       ↓
re-run the failing case + regression suite on the updated commit
       ↓
compare evidence; finish only when explicit acceptance criteria pass
```

Do not let the agent mark its own generated test as “passing” or accept a natural-language explanation in place of a real run. The engine's recorded result is authoritative.

### 6.5 Make test plans explainable

Every generated test should include:

```json
{
  "id": "test_authz_order_owner_boundary",
  "kind": "authorization_invariant",
  "goal": "A user cannot read another user's order",
  "modelRefs": ["endpoint:GET:/orders/{orderId}"],
  "sourceEvidence": [
    { "file": "src/orders/orders.routes.ts", "line": 42, "kind": "route" },
    { "file": "src/orders/orders.service.ts", "line": 88, "kind": "ownership-check-candidate" }
  ],
  "assumptions": ["The test fixture can create two isolated users and one order per user"],
  "setup": ["create user A", "create user B", "create order for user B"],
  "actions": ["request B's order using A's auth profile"],
  "assertions": ["request is denied or response is safely masked according to configured contract"],
  "cleanup": ["delete test-owned users and orders"],
  "confidence": { "level": "candidate", "reason": "route and likely ownership check found; business rule not yet explicitly declared" },
  "budget": { "maxRequests": 8, "maxDurationSeconds": 30 }
}
```

A source scan can suggest an ownership invariant, but only a declaration, existing test, or validated behavior can establish what the expected result should be. If the policy is unknown, output `needs_confirmation` rather than inventing a contract.

---

## 7. The core model: don't let everything collapse into one `model.json`

A single JSON file can remain a simple export artifact, but it should not be the only internal structure once Jetic supports incremental scanning, endpoint editing, concurrent web sync, workflows, and run history.

Recommended `.jetic/` layout:

```text
.jetic/
├── config.yaml                  # project-level settings; no plaintext credentials
├── safety.yaml                  # allowed hosts, protocols, methods, budgets, approval policy
├── model/
│   ├── manifest.json            # model schema version, source commit, scan metadata
│   ├── services/                # service-level metadata
│   ├── endpoints/               # individual normalized endpoint records
│   ├── schemas/                 # request/response schemas and references
│   ├── evidence/                # source paths, line ranges, provenance, confidence
│   └── exports/                 # generated OpenAPI/model exports
├── environments/
│   ├── local.yaml               # variable names/references, not raw secrets
│   └── staging.yaml
├── auth-profiles/               # profile metadata, no raw token values
├── workflows/
│   ├── checkout.jetic.yaml
│   └── user-registration.jetic.yaml
├── tests/
│   ├── suites/
│   ├── cases/
│   └── policies/
├── simulations/
│   ├── checkout-smoke.yaml
│   └── mixed-journey.yaml
├── fixtures/                    # synthetic/generated test data, not production data
├── runs/                        # optional small local metadata/cache; bulky artifacts elsewhere
└── cache/                       # derived, safely disposable scan cache
```

Do not require one file per trivial object if it harms performance; the key is independent/versioned records, diffable project files, proper indexes in the cloud database, and no single giant mutable blob as the source of truth.

### Model versioning and provenance

Every endpoint/property should carry some combination of:

- stable resource ID;
- normalized operation (`method`, `path`, service ID, operation ID);
- parameters and request/response schemas;
- auth profiles/requirements and middleware evidence;
- links to other operations and observed state dependencies;
- code provenance (`file`, source range, AST node ID, commit hash);
- evidence origin (`declared`, `observed`, `static-inferred`, `human-authored`, `agent-proposed`);
- confidence reason and unresolved questions;
- created/updated model version;
- fingerprint for incremental change detection.

When the source code changes, Jetic should identify affected model nodes, rerun relevant tests, and preserve the previous version for comparison. Never silently rewrite a human-verified business rule based on a weak source inference.

---

## 8. How the test engine should work internally

### 8.1 Planner does not equal executor

Use AI for tasks where language/context helps:

- proposing business-relevant workflows from endpoint models;
- interpreting a code diff and selecting impacted routes;
- suggesting edge cases based on schemas and validation logic;
- proposing authorization matrices and data fixtures;
- classifying error clusters or summarizing evidence;
- recommending next tests when results are ambiguous.

Use deterministic code for:

- parsing/validating test definitions;
- resolving environment variables and credential handles;
- enforcing host/method/budget policies;
- serializing HTTP requests;
- ordering dependencies and executing workflow states;
- retries, deadlines, captures, assertions, cleanup, and cancellation;
- computing performance statistics and comparing runs;
- writing result events and reports.

This prevents nondeterministic agent output from becoming a testing oracle. Store planner model/provider/version, prompt/template version, input model snapshot, and generated plan hash for audits, but don't put raw secrets in prompts.

### 8.2 Model the full API as a graph

Useful node types include:

- route/operation;
- request/response schema;
- auth profile/role/identity;
- middleware/validation gate;
- controller/handler/service/repository;
- entity/resource and likely foreign-key/ownership link;
- external service (email, payments, webhooks, storage, queue);
- declared business invariant;
- workflow/test/fixture;
- source file and commit.

Edges should be typed and evidence-backed: `calls`, `validates-with`, `requires-auth`, `writes-resource`, `reads-resource`, `captures-id-for`, `triggers-webhook`, `is-covered-by`, `observed-before`, or `inferred-dependency`. A graph makes impact analysis, stateful generation, and explainable test selection possible.

### 8.3 Multi-phase test generation

Recommended execution phases:

1. **Known examples:** valid request examples from OpenAPI/tests/source fixtures.
2. **Operation coverage:** each endpoint/method, parameter location, validation branch, auth profile, and documented response.
3. **Boundary/negative values:** missing/null/empty, type mismatches, enum/range/length boundaries, unusual but safe encoding, pagination, duplicate keys, content-type mismatch.
4. **Stateful exploration:** infer operation ordering from declared links, observed traffic, resource references, and setup/cleanup requirements. Prefer stateful workflows over independent random calls.
5. **Authorization matrix:** test each role/principal against allowed/denied operations and ownership/property rules using isolated identities.
6. **Business invariants:** enforce declared outcomes and uniqueness/idempotency (payments, refunds, orders, subscriptions, invitation use, quota consumption).
7. **Resilience and fault handling:** controlled timeout/dependency failure/webhook delays/retries, only in isolated or explicitly approved environments.
8. **Performance and saturation:** execute a validated workload with thresholds and resource/runner telemetry.
9. **Agent-guided follow-up:** after a failure, propose targeted tests based on evidence; all plans still pass the deterministic validator.
10. **Minimization and verification:** shrink the failure and replay the reproducer; run regression tests after a fix.

Don't blindly stop after the first failure for all workflows. Support a policy that decides whether to stop one scenario, continue other independent operations, or abort the whole run because the target appears unhealthy or the budget threshold was hit.

### 8.4 Confidence and expected results

Every assertion must identify where its expected behavior came from:

- `explicit`: human or API contract declared it;
- `existing-test`: established by a test in the repository;
- `observed-baseline`: learned from a controlled run, but not necessarily normative;
- `inferred`: suggested by static analysis/agent reasoning;
- `unknown`: expected behavior not safely known.

For example, if `/orders/:id` currently returns `200` to a non-owner, Jetic must not automatically define `200` as expected because it was observed. If ownership semantics are unknown, the finding is a **candidate** pending a declared rule or human confirmation. If a confirmed security invariant says non-owners must be denied, the same observation becomes a supported regression/security finding.

### 8.5 Test data, variable memory, and cleanup

- Give each run and virtual user an isolated namespace where possible.
- Generate unique emails/IDs with a recorded seed.
- Store variables as typed values with scope (`run`, `workflow`, `virtual-user`, `step`) and secret marking.
- Never expose secret variables in the UI, prompts, standard output, or exported artifacts; reveal only masked status.
- Attach cleanup actions to setup operations and execute cleanup in a `finally`-style path even when the workflow fails or is cancelled.
- Report failed cleanup as a distinct result.
- Prefer disposable databases, seeded test tenants, or provider sandboxes for write-heavy workflows.

---

## 9. Simulation system: make it credible, not just concurrent traffic

A simulation is a composition of **actors + journeys + data + timing + constraints + observations**.

### Actors

Examples: anonymous visitor, authenticated user, customer/admin, webhook provider, background job, third-party dependency. Actors are test identities or simulated dependencies, not scraped real user accounts.

### Journey

A journey is a valid workflow graph such as registration → verification → login → create cart → checkout → payment callback → order confirmation. Variants may branch based on subscription, inventory, or payment state.

### Data

Data profiles describe synthetic accounts, test catalog records, different payload sizes, tenant ownership, and resource lifecycle. Default generation must be synthetic; production data import requires an explicit and documented anonymization process.

### Timing

Timing determines user think time, arrival rates, concurrency, ramp stages, dependency delay distributions, and retry delays. Randomness must be seeded and recorded.

### Constraints

Set total request budget, per-route RPS ceiling, max VUs, max duration, allowed methods, allowed hostnames, max response bytes, financial-provider sandbox restrictions, and automatic abort conditions.

### Observations

Collect latency, success rates, errors, dropped iterations, workflow progress, external-call counts, runner load, and any permitted target telemetry. Correlate events using a run/virtual-user/request trace ID.

### Example simulation definition

```yaml
schemaVersion: jetic.dev/simulation/v1
name: checkout-smoke
workflow: checkout
environment: staging-sandbox
seed: 481516
workload:
  type: ramp-vus
  stages:
    - duration: 30s
      users: 1
    - duration: 60s
      users: 5
    - duration: 30s
      users: 0
  thinkTime:
    min: 200ms
    max: 1200ms
limits:
  maxDuration: 3m
  maxRequests: 2500
  maxConcurrentRequests: 25
  perEndpointRps:
    "POST /auth/login": 3
    "POST /orders": 2
  maxResponseBytes: 2MiB
thresholds:
  httpErrorRate: "< 0.01"
  p95Latency: "< 800ms"
  p99Latency: "< 1500ms"
  droppedIterations: "== 0"
stopConditions:
  - sustainedErrorRateAbove: 0.10
    for: 10s
  - consecutiveTimeouts: 20
safety:
  requireApprovedTarget: true
  allowExternalSideEffects: false
  requireCleanup: true
```

The exact DSL is a proposal and should be schema-validated. The crucial product design is that the plan can be previewed, capped, and reproduced before execution.

---

## 10. Safety and security requirements

Jetic executes requests against real applications. A product that can automatically exercise arbitrary APIs must have strong security boundaries from the beginning.

### Target authorization

- Bind test environments to explicit allowed hosts and ports.
- Deny localhost, private, link-local, cloud metadata, and internal control-plane addresses by default for remote/managed runners unless a specifically authorized local-runner policy permits them.
- Revalidate DNS resolution at connection time; protect against redirects to disallowed hosts and DNS rebinding.
- Enforce protocol allowlists, TLS verification, request timeouts, redirects policy, response-byte caps, and concurrency ceilings.
- Do not let a user-controlled URL make the web backend or worker fetch arbitrary internal network resources (SSRF).
- Require an explicit policy to test a production host. Use an even lower safety budget for production; block state mutations by default.

### Execution boundaries

- Separate test workers from the web/API process.
- Use a restricted subprocess/container for untrusted code or plugins. Better still, do not execute arbitrary repository code as part of routine scanning; static analysis should remain the default.
- Use CPU/memory/time limits, bounded queues, cancellation, and crash-safe artifact writes.
- Never accept a remote instruction that maps directly to arbitrary shell execution.
- Validate every agent-supplied plan and tool input with a versioned schema, allowlists, and server-side authorization.

### Data protection

- Redact secrets, cookies, authorization headers, OTPs, payment data, and likely PII from telemetry by default.
- Cap captured request/response sizes and provide per-field redaction rules.
- Make body capture opt-in where possible; offer metadata-only mode.
- Separate trace metadata from larger artifact storage and use retention/deletion policies.
- Use write-only secret APIs and short-lived, scoped credentials.
- Never send raw credentials, entire `.env` files, or credential-bearing HTTP bodies to an LLM.
- Include a “what will be stored/shared” preview when a user enables cloud sync or report upload.

### Load/abuse safety

- Simulations start with conservative limits and a dry-run plan.
- Each run needs maximum duration, requests, concurrency, per-endpoint RPS, and byte budget.
- An emergency stop must halt scheduling immediately and cancel outstanding requests where possible.
- Automatically stop if the target shows severe failure conditions, the runner is saturated, or the predeclared budget is reached.
- Don't include a one-click unbounded flood mode or automated password/OTP brute force.
- Use sandbox payment/email/SMS providers and idempotent fixtures to avoid unexpected real-world costs.

### Agent safety

- Tool outputs must be sanitized and bounded.
- Sensitive actions require approval; approval is attached to a specific target/policy/plan hash rather than a generic “yes for everything.”
- Agents cannot alter safety policy, approve their own requested elevation, fetch secret values, or execute raw shell through a testing tool.
- Store a readable audit trail for every plan, approval, request run, stop, and artifact export.

---

## 11. Result schema and reporting contract

All commands that produce findings should use a common result vocabulary:

- `passed`: the assertion was evaluated and passed;
- `failed`: the assertion was evaluated and failed;
- `error`: engine/configuration/execution infrastructure failed;
- `skipped`: not run by explicit policy or unmet precondition;
- `inconclusive`: insufficient evidence to assert pass or fail;
- `cancelled`: cancellation was requested;
- `flaky`: evidence indicates inconsistent results across repeated runs, with the underlying individual statuses retained.

A run should keep these fields at a minimum:

```json
{
  "schemaVersion": "jetic.dev/run-result/v1",
  "runId": "run_01...",
  "projectId": "project_01...",
  "status": "failed",
  "startedAt": "2026-10-17T09:30:00Z",
  "finishedAt": "2026-10-17T09:30:08Z",
  "source": { "commit": "abc123", "modelVersion": 18 },
  "target": { "environment": "staging-sandbox", "baseUrlLabel": "staging" },
  "plan": { "id": "suite_authz", "hash": "sha256:...", "seed": 481516 },
  "summary": {
    "tests": 31,
    "passed": 29,
    "failed": 1,
    "errors": 0,
    "skipped": 1,
    "inconclusive": 0,
    "requests": 82,
    "durationMs": 8100
  },
  "findings": [
    {
      "id": "finding_01...",
      "kind": "authorization_invariant",
      "severity": "high",
      "confidence": "confirmed",
      "title": "A non-owner can read another user's order",
      "evidenceRefs": ["exchange_19", "assertion_7", "source:src/orders/orders.service.ts:88"],
      "reproductionId": "case_7",
      "recommendation": "Apply ownership authorization before returning the order",
      "sensitiveDataRedacted": true
    }
  ],
  "artifacts": [
    { "kind": "trace", "id": "artifact_trace_1", "sha256": "..." },
    { "kind": "junit", "id": "artifact_junit_1", "sha256": "..." }
  ]
}
```

Don't export raw auth headers/bodies by default. Include links or artifact handles, not secret-bearing inline content. The failure title/recommendation may use AI-generated prose, but the status, metric values, evidence references, and policy decisions must originate from the engine's records.

### Exit codes

Use a documented stable exit-code table, for example:

| Code | Meaning |
|---:|---|
| `0` | Command completed and acceptance criteria passed. |
| `1` | One or more tests/assertions failed. |
| `2` | Invalid invocation/configuration/schema. |
| `3` | Environment/auth/target policy blocked execution. |
| `4` | Infrastructure/engine error. |
| `5` | Run was cancelled or exceeded a configured deadline. |
| `6` | Inconclusive result or required confirmation missing, where CI policy wants this to fail closed. |

Exact values can differ, but scripts must not have to parse human text to know whether a test passed.

---

## 12. Implementation roadmap: build vertical slices, not a huge command tree

### Phase 0 — Audit and contract freeze

Deliverables:

- capture current `jetic --help` and subcommand help;
- map existing files and implementations;
- add tests for current `scan` and `dev` behaviors before refactoring;
- define versioned CLI output envelopes and exit codes;
- decide how the current `model.json` migrates to versioned model records;
- document supported frameworks/runtime versions and unsupported syntax.

**Exit criteria:** an auditable current-command inventory; no guessing about what today's package supports.

### Phase 1 — Trustworthy local core (P0)

Implement:

- `init`, `doctor`, `config validate`;
- robust `scan` with provenance, framework adapters, schema versioning, incremental updates;
- `model status/list/show/diff/validate/export`;
- `env` configuration, safe secrets, allowlist and request budgets;
- a deterministic HTTP client with timeouts, cancellation, caps, redirects/DNS policy, and redaction;
- stable JSON output and exit codes.

**Exit criteria:** a clean clone can scan a supported Node.js project, show exactly which endpoints were found and why, export a valid model, and reject unsafe target URLs.

### Phase 2 — One complete testing loop (P0)

Implement:

- baseline test generation;
- test schema validation;
- sequential workflows with variable capture and assertions;
- durable run records, request/response summaries, cancellation;
- failure minimization for at least a small class of deterministic inputs;
- JUnit/JSON export and useful CLI report.

**Exit criteria:** user can scan a sample service, create a realistic multi-step workflow, run it twice with a fixed seed, and reproduce the same failure without manually scraping the terminal.

### Phase 3 — Web orchestration and agent integration (P1)

Implement:

- versioned runner protocol and capability discovery;
- authenticated project linking and narrow sync;
- MCP tools over stdio;
- remote control plane can enqueue work to a local runner safely;
- planner output typed as a draft and validated by the engine;
- approval flow for mutations, production targets, and simulations.

**Exit criteria:** a coding agent can inspect a model, propose a workflow, validate it, run it in an approved environment, inspect the result, and provide a grounded summary without direct access to secrets or arbitrary shell/network calls.

### Phase 4 — Stateful testing and API abuse baselines (P1)

Implement:

- schema-guided valid/invalid generation;
- dependency graph and operation ordering;
- role/tenant/ownership matrices using fixtures;
- idempotency/retry/rate-limit/business-invariant tests;
- minimized regression promotion;
- report severity/confidence/evidence handling.

**Exit criteria:** demonstrate a reproducible bug that independent endpoint pings would miss—for example, duplicate checkout causing duplicate orders, or cross-tenant object access.

### Phase 5 — Load/simulation engine (P1)

Implement:

- only 2–3 workload shapes at first (`constant-vus`, `ramp-vus`, `arrival-rate`);
- workflow-to-virtual-user execution;
- explicit limits and abort criteria;
- percentile metrics and thresholds;
- runner self-metrics to identify load-generator bottlenecks;
- environment comparison and repeatable seeds.

**Exit criteria:** run a bounded staged simulation, correctly stop on threshold/limit, and report where degradation starts with environment and runner context.

### Phase 6 — Ecosystem and advanced testing (P2)

Consider after retention/quality/usage data justifies the work:

- traffic record/replay;
- Arazzo import/export;
- Postman collection import/export;
- GraphQL/gRPC/AsyncAPI adapters;
- chaos/fault injection in isolated environments;
- plugin system and third-party adapters;
- distributed/load-generator fleet;
- richer code security analysis and SARIF;
- browser-level journeys using Playwright for web UI cases tied to API traces.

**Exit criteria:** new adapters don't weaken core security, reproducibility, or result contracts.

---

## 13. Suggested repository architecture for the CLI/runtime

Use a modular monolith initially; don't introduce a service for every file. The key boundaries are command parsing, domain model, adapters, runner, policy, and outputs.

```text
packages/cli/
├── src/
│   ├── bin.ts
│   ├── cli.ts
│   ├── commands/
│   │   ├── init/
│   │   ├── dev/
│   │   ├── scan/
│   │   ├── model/
│   │   ├── env/
│   │   ├── test/
│   │   ├── workflow/
│   │   ├── simulate/
│   │   ├── security/
│   │   ├── run/
│   │   ├── report/
│   │   ├── sync/
│   │   └── mcp/
│   ├── runtime/
│   │   ├── command-context.ts
│   │   ├── capability-registry.ts
│   │   ├── cancellation.ts
│   │   └── protocol/
│   └── output/
│       ├── cli-reporter.ts
│       ├── json-reporter.ts
│       ├── jsonl-reporter.ts
│       ├── junit-reporter.ts
│       └── redaction.ts
packages/core/
├── src/
│   ├── model/
│   ├── provenance/
│   ├── graph/
│   ├── tests/
│   ├── workflows/
│   ├── simulations/
│   ├── findings/
│   ├── budgets/
│   └── errors/
packages/scanner/
├── src/
│   ├── inventory/
│   ├── ast/
│   ├── adapters/
│   ├── dependency-graph/
│   └── incremental/
packages/engine/
├── src/
│   ├── plan-validator/
│   ├── compiler/
│   ├── scheduler/
│   ├── http-client/
│   ├── workflow-runtime/
│   ├── assertions/
│   ├── fixtures/
│   ├── simulation-runtime/
│   ├── limits/
│   └── events/
packages/policy/
├── src/
│   ├── target-allowlist.ts
│   ├── ssrf-protection.ts
│   ├── request-budgets.ts
│   ├── approval-policy.ts
│   └── redaction-policy.ts
packages/agent-planner/
├── src/
│   ├── planner.ts
│   ├── prompt-context.ts
│   ├── tool-schemas.ts
│   ├── evidence-grounding.ts
│   └── provider-adapters/
packages/adapters/
├── openapi/
├── arazzo/
├── postman/
├── har/
├── express/
├── fastify/
├── nestjs/
└── nextjs/
packages/reporting/
├── src/
│   ├── result-schema/
│   ├── metrics/
│   ├── compare/
│   ├── junit/
│   ├── sarif/
│   └── html/
tests/
├── fixtures/
├── scanner/
├── engine/
├── safety/
├── integrations/
└── e2e/
```

### Dependency direction

`CLI commands → application use cases → core model/engine interfaces → adapters/infrastructure`.

- Core domain logic must not import CLI libraries, LLM SDKs, or web framework request types.
- The agent planner emits candidate plans through a typed interface. It should not invoke an engine internal function that bypasses plan validation.
- All outbound HTTP flows must go through the same policy-enforcing transport boundary.
- All result writers use a shared normalized result schema.
- Framework adapters emit evidence into the same core model; don't duplicate the testing engine per framework.
- Write unit tests for pure logic, adapter fixtures for scanner correctness, integration tests against local services, and end-to-end tests for scan → workflow → run → report.

---

## 14. Quality, metrics, and acceptance criteria

### Scanner quality

- Every discovered endpoint records a source location/evidence type or is marked dynamically observed/inferred.
- Scan results contain explicit `unknowns`; they never silently disappear.
- Full and incremental scans converge to the same model.
- Repeated scan on unchanged source produces a stable model fingerprint.
- Unsupported syntax/framework cases generate diagnostics instead of hallucinated endpoints.

### Execution quality

- Same versioned plan + same seed + same environment fixture should reproduce the same generated inputs and workflow decisions, aside from explicitly recorded external nondeterminism.
- All long-running jobs support status, timeout, and cancellation.
- All network requests are budgeted and pass through target policy.
- Test cleanup runs after failed/cancelled workflows where possible, with explicit cleanup failures.
- A failed assertion, timeout, policy block, and engine error are different statuses.

### Agent quality

- Every proposed test references at least one model node, source location, existing test, declared rule, or observed trace. If no evidence exists, it says so.
- Agent plans cannot exceed configured budgets.
- Agent outputs are schema-validated and cannot redefine run status.
- An agent can inspect reports without access to raw credentials or redacted body contents.
- A test suggestion must be able to be saved, reviewed, and replayed independently of the original AI conversation.

### Performance/simulation quality

- Jetic measures runner saturation and avoids mistaking a slow generator for a slow target.
- Reports include latency quantiles, error rates, throughput, run duration, and resource/context metadata.
- Thresholds are user-visible and versioned.
- Simulations halt on budget limits and severe target errors.
- A repeat/comparison run shows environmental caveats when deployment/region/instance/seed differs.

### Product metrics worth tracking

- endpoints discovered / confirmed / unknown;
- percentage of model nodes linked to source evidence;
- generated test acceptance rate (how many proposed cases become stable tests);
- unique confirmed bugs per 100 test-minutes;
- time-to-reproducer and test-minimization success rate;
- flake rate by test/profile;
- time from commit change to impacted regression results;
- local runner overhead and max sustainable RPS under a known test;
- agent suggestion groundedness (percentage with valid evidence references);
- unsafe run requests blocked by policy;
- cleanup success rate;
- false-positive rate determined by human triage.

Avoid vanity metrics such as number of requests or number of AI-generated tests without evidence that they uncover real defects or improve feedback time.

---

## 15. Example: how Jetic should test checkout better than “ping endpoints”

Assume the API exposes login, product, cart, checkout, payment status, webhook, order detail, refund, and order history routes.

### Step 1: understand prerequisites

- Scanner identifies operations, auth middleware, schema validators, payment adapter, and likely order/cart entities.
- Model links `POST /cart/items` to `POST /checkout`, which yields an order/payment reference used by `GET /orders/{id}` and a payment webhook.
- Jetic marks inferred links as inferred until confirmed by OpenAPI links, tests, or observed runs.

### Step 2: create controlled fixtures

- User A, user B, a test product with inventory, and a sandbox payment provider.
- Unique run prefix and deterministic data IDs.
- Fixture adapters can clean up orders/cart items after the test, including failure paths.

### Step 3: generated workflows

1. Login as A.
2. Read product inventory.
3. Add product to cart.
4. Checkout once.
5. Capture order and payment IDs.
6. Simulate the payment callback through a test provider/receiver.
7. Assert one paid order and one successful payment state transition.
8. Request the order as A and as B.
9. Issue a repeated checkout or duplicate callback under a tiny bounded policy.
10. Request refund at the allowed amount and one invalid over-refund boundary.
11. Verify audit/status views agree and cleanup succeeds.

### Step 4: test invariants, not only responses

- no duplicate charge/order on retry;
- payment callbacks are idempotent and signature-validated;
- an order cannot be read or modified by a non-owner;
- a refund cannot exceed captured amount;
- an order cannot be refunded twice past its available amount;
- inventory is not oversold under a small, explicitly controlled concurrency test;
- state transition ordering is valid (for example cancelled → paid is rejected unless the business contract allows it);
- externally triggered side effects use sandbox services and are bounded.

### Step 5: run performance profile

Reuse the validated checkout workflow with synthetic identities and a `ramp-vus` or `arrival-rate` profile. Report p95/p99 latency, errors, dropped iterations, duplicate-order invariant failures, and target/runner measurements.

### Step 6: produce a usable defect

A defect report should include the minimal sequence, environment/model/commit versions, seed, sanitized request/response evidence, violated invariant, source references, and a one-command replay. It should not just say “AI thinks checkout could fail.”

This example illustrates the intended Jetic advantage: a single grounded model makes functional tests, security/authorization tests, abuse-resistance checks, and performance journeys share context rather than being four disconnected products.

---

## 16. Decisions to make early

1. **Model source of truth:** versioned local model files plus cloud relational records; `model.json` remains an export/compatibility format, not an unbounded mutable database.
2. **Workflow format:** Jetic-native schema with Arazzo import/export for compatible API steps.
3. **Agent contract:** typed TestPlan/WorkflowDraft plus an execution protocol; no free-form prompt as the engine input.
4. **Local/web split:** CLI runner handles local network and execution; web control plane manages projects, orchestration, collaboration, jobs, and reports.
5. **MVP framework support:** start with the framework that real users most often use and prove adapter accuracy with fixtures before promising “any Node.js repo.”
6. **Security default:** target allowlist + conservative request budgets + no production mutation by default.
7. **Retention/redaction:** decide what raw request/response content is saved, for how long, where, and under what workspace access policy.
8. **Load execution:** specify whether load generation is local, managed, or hybrid; benchmark the runner before advertising capacity estimates.
9. **Result compatibility:** version JSON output, exit codes, run events, and artifact schemas.
10. **Evidence policy:** a source inference is not a confirmed assertion. Unknown expected behavior must remain explicit.

---

## 17. Final recommendation

Build Jetic in this order:

**Scan accurately → represent evidence → define/run a deterministic workflow → store a trustworthy trace → generate grounded next tests → add safe negative/authorization tests → add workflow-driven simulations → widen integrations.**

Do not start by implementing fifty CLI commands, a plugin marketplace, or a multi-agent swarm. They multiply surface area before the execution semantics are proven. Make the existing `scan` command produce a dependable, versioned model; make `dev` update it incrementally; then deliver one unmistakably good workflow/run/report loop. Add the agent bridge only after the deterministic core can tell an agent exactly what ran and why it passed or failed.

The moment Jetic can find a real multi-step regression, reproduce it from a CLI command, show evidence tied to source and runtime behavior, and prove the fix on the next commit, the product has a credible wedge. Load generation, contract import/export, and broader protocol support can expand that wedge without weakening the central promise.

---

## 18. References

1. Grafana k6 — [Scenarios](https://grafana.com/docs/k6/latest/using-k6/scenarios/), [Thresholds](https://grafana.com/docs/k6/latest/using-k6/thresholds/), [Options reference](https://grafana.com/docs/k6/latest/using-k6/k6-options/reference/), [Browser testing](https://grafana.com/docs/k6/latest/using-k6-browser/running-browser-tests/).
2. Postman — [CLI collection commands](https://learning.postman.com/docs/postman-cli/postman-cli-collections), [Run a collection with the CLI](https://learning.postman.com/docs/postman-cli/postman-cli-run-collection).
3. Schemathesis — [CLI tutorial](https://schemathesis.readthedocs.io/en/stable/tutorials/cli/), [CLI reference](https://schemathesis.github.io/schemathesis/reference/cli/), [Continuous fuzzing](https://schemathesis.readthedocs.io/en/stable/guides/continuous-fuzzing/).
4. OpenAPI Initiative — [Arazzo Specification 1.1.0](https://spec.openapis.org/arazzo/latest.html), [Arazzo overview](https://www.openapis.org/arazzo-specification).
5. Keploy — [CLI commands](https://keploy.io/docs/running-keploy/cli-commands/).
6. OWASP — [API Security Top 10 risks](https://api-security.owasp.org/editions/2023/en/0x11-t10/), [API4: Unrestricted Resource Consumption](https://api-security.owasp.org/editions/2023/en/0xa4-unrestricted-resource-consumption/).
7. OpenTelemetry — [HTTP semantic conventions](https://opentelemetry.io/docs/specs/semconv/http/), [HTTP metrics](https://opentelemetry.io/docs/specs/semconv/http/http-metrics/).
8. IETF — [RFC 9457: Problem Details for HTTP APIs](https://www.rfc-editor.org/info/rfc9457/).
9. Model Context Protocol — [Tools specification](https://github.com/modelcontextprotocol/modelcontextprotocol/blob/main/docs/specification/2026-07-28/server/tools.mdx), [Authorization security considerations](https://github.com/modelcontextprotocol/modelcontextprotocol/blob/main/docs/specification/2026-07-28/basic/authorization/security-considerations.mdx).
10. Jetic current-state note — commands `jetic scan` and `jetic dev` are included from prior project context. Verify the actual repository/package source before treating any proposed command as implemented.

---

## Appendix A — Quick command map

This is a compact view of the proposed future command tree. It does **not** mean every entry exists today.

```text
jetic
├── init
├── doctor
├── config {show,get,set,validate,path}
├── dev [--port] [--no-open] [--watch]
├── scan [--watch] [--full] [--scope] [--strict] [--baseline]
├── model {status,list,show,diff,validate,export,import,sync,history,annotate}
├── env {list,show,create,use,set,secret,validate}
├── auth {list,create,test,revoke}
├── test {list,generate,validate,run,replay,explain,promote,quarantine,minimize,diff,export}
├── run {status,list,inspect,logs,cancel,retry,artifacts,export,compare}
├── workflow {list,new,show,validate,compile,run,replay,record,import,export,diff,debug}
├── simulate {list,new,validate,plan,run,status,stop,report,compare,calibrate}
├── capacity {plan}
├── security {list,plan,run,baseline,export}
├── authz {plan,run}
├── boundary {run}
├── abuse {plan,run}
├── record {start,stop,convert}
├── mock {generate,serve}
├── fixture {generate,load,cleanup}
├── webhook {receive}
├── proxy {inspect}
├── report {show,open,export,compare,redact,verify,publish}
├── login / logout
├── workspace {list,use}
├── link
├── sync {push,pull,status}
├── agent {serve}
├── mcp {serve,install}
├── adapter {list,inspect,validate}
└── plugin {list,install,disable}
```

## Appendix B — A practical first release command set

For a realistic first release, implement these well before expanding the tree:

```text
jetic --help / --version
jetic init
jetic doctor
jetic config validate
jetic dev
jetic scan [--watch]
jetic model status / list / show / diff / validate / export / import
jetic env list / validate
jetic test generate / validate / run / replay
jetic workflow new / validate / run / replay
jetic run status / inspect / cancel / export
jetic report show / export
jetic mcp serve
```

Then add safe security/authorization profiles and simulations once model provenance, target policy, idempotency, cancellation, redaction, and result persistence are solid.
