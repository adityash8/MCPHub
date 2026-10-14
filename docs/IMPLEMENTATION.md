# MCPHub Phase 0 implementation plan

## Correction plan (13 Oct 2026)

1. Replace the alphabetical registry slice with 50+ manually chosen, useful official Registry listings only after fetching each current full record and checking vendor/package documentation. Record category, inclusion reason, source URL, version/transport/auth evidence, and the limit of verification. An unreachable public source is a release blocker, never a reason to invent metadata.
2. Reject exports when package version, binary, transport, or required auth cannot be represented safely by the selected client. Keep the existing three-server, copy/download, Continue YAML, local version, and email flows.
3. Label the directory and detail view as metadata/config-schema checked, with connection, install, package health, and security untested. Add adversarial tests and a browser acceptance script.

Proof: `npm run typecheck`, `npm run lint`, `npm test -- --runInBand`, `npm run build`, `node tests/browser-smoke.cjs` against a local app where Chrome is available, and `git diff --check`. The browser script must cover search/filter, detail requirements, three-server limit, each client export format, copy/download, save/reload, mobile width, and page errors. Public API changes will be recorded below.

Scope: deliver the 48-hour directory and configuration flow in the existing blue and neutral UI. Use the saved official MCP Registry response as the source for 50+ current records. Present only metadata the response actually contains; label executable and remote requirements, and block exports a client cannot represent. Keep the free limit at three selections. Save selections and generated versions in this browser, without sign-up or cross-device claims. Email capture remains only if it persists to a real service.

## Proof before implementation

- `npm run typecheck` for TypeScript and client contract coverage.
- `npm run lint` for source lint.
- `npm test -- --runInBand` for registry import, per-client config structure, limits/persistence, and failure cases. A local fixture MCP handshake/tools/list test will only attest to our protocol handling, not third-party health.
- `npm run build` for the production app.
- Browser smoke: open `/directory`, filter/search, inspect requirements, select three, preview, copy/download supported client configs, save and restore a version, refresh, and repeat at mobile width. Verify honest blocked states and empty results.

## Delivery scope

Implement US-001 through US-004 and US-011 to the extent supported by official registry fields, plus browser-local saved config history. Phase 1 account sync/billing, Phase 2 monitoring, and later community/team/creator stories remain roadmap. This file will be updated with exact coverage, evidence, external gates, changed files, and public API changes.

## Delivered story coverage

| PRD story | Coverage | Notes |
| --- | --- | --- |
| US-001 Browse directory | Partial | 53 manually selected latest active listings from full Registry search records. Search, editorial categories, registry-update/name sort, mobile grid, and detail entry. Registry data has no GitHub stars, commits, ratings, or health checks, so none are claimed. The selection spans developer, productivity, and client workflows. Registry presence is not independent security vetting. |
| US-002 View details | Partial | Description, exact registry version, package or remote transport, required variables/headers, publisher/source links, and a selection action. Changelog, reviews, related items, and independently verified install guides are not claimed; only five npm launch templates have publisher setup evidence. |
| US-003 Select multiple | Phase 0 complete | Up to three selections, removal, limit feedback, local session continuation and browser persistence. There is no account or paid entitlement. |
| US-004 Generate client config | Phase 0 complete for supported metadata | Claude Desktop, Cursor, Cline JSON and Continue `config.yaml`; preview, copy, download, setup steps, validation, required-variable checklist, and fixed package versions. A publisher-documented remote URL exports for Cursor only when no required header is declared. Other remote/client combinations and required remote auth headers are blocked with a reason. Credentials are never entered or stored; exported placeholders must be replaced locally. |
| US-011 Search | Partial | Real-time search of title, registry name, description, and category plus filter and result count. Search uses native keyboard text entry. Highlighted terms and custom arrow-key result navigation are not implemented. |
| Phase 0 email capture | Adapter complete; cloud gate | JSON endpoint validates a bounded request and uses a product-prefixed Supabase function for persistence and five attempts per IP hash per day. It requires one valid IP in Vercel's `x-vercel-forwarded-for` header; an absent or invalid value returns 503 before database access. The form reports failure when it cannot persist. The migration and environment variables must be applied before email capture works. No signup or alerts are implied. |
| Extra saved config experience | Complete locally | Last ten exact exported templates, their registry versions, and selected IDs stay in this browser. Users can download the exact saved template or restore its selection for a fresh export. No cross-device sync. |

Phase 1 account, billing, and sync; Phase 2 monitoring; and later digest, community, team, and creator stories remain roadmap. No paid checkout, health status, rating, or install success is simulated. The repo's PostHog provider remains in place, but analytics depends on its own existing configuration.

## Metadata and client rules

- Source snapshot: `../../external/startup-delivery/build-next10/curation-registry-full.json`, curated into `lib/registry.json` on 13 Oct 2026. It contains 53 latest active names/versions across 28 developer, 10 productivity, and 15 client workflow listings. Each record has its source search URL, inclusion reason, category, exact transports/requirements, and verification scope.
- Exact npm package metadata was read for 31 stdio package versions; two published packages have no single binary. Publisher README launch syntax was inspected for all five enabled npm entries. Five npm exports are enabled (Next DevTools, Brave Search, Tavily, Firecrawl, Figma Developer); other npm entries stay visible with export blocked pending command and required setup verification. No third-party package was installed or executed. `npx -y --package <package>@<version> <binary>` is emitted. Required environment settings appear in an explicit checklist and placeholder values; Firecrawl follows its publisher default-cloud requirement over the Registry optional flag.
- Remote URLs are only emitted for Cursor, which documents URL entries in `mcpServers`. Claude Desktop remote connectors need their own UI flow. Continue uses a YAML `mcpServers` list for stdio entries. Unsupported remote formats remain blocked pending verified client-specific auth and transport support.
- Server descriptions, package contents, and remote endpoints come from publishers through the registry. Users should inspect a server before running it. This app never launches a third-party server or contacts its endpoint.

## Verification evidence

- `npm run typecheck` → exit 0.
- `npm run lint` → exit 0.
- `npm test -- --runInBand` → `Test Suites: 6 passed, 6 total; Tests: 27 passed, 27 total`.
- `npm run build` → exit 0; Next.js 15.5.27 built `/`, `/directory`, and `/api/email-capture`.
- `git diff --check` → exit 0.
- Production HTTP smoke (`npm run start -- --hostname 127.0.0.1 --port 3107` then `curl`): `/` 200, `/directory` 200, unconfigured `POST /api/email-capture` 503. Both pages contain their expected headings.
- The own fixture test performs MCP `initialize` and `tools/list`; it does not assert the health of registry entries.
- Visual browser smoke was attempted with local Playwright and Chrome, but Chrome aborted at launch under this workspace sandbox (`TargetClosedError`, `SIGABRT`). Mobile layout and click flow therefore need a browser pass in the parent's release environment. The Impeccable detector ran once and reported only lexical gray-on-blue warnings from long JSX lines; inspect actual rendered contrast during that pass.

## External prerequisites and release gates

1. Parent applies `supabase/migrations/20261013_mcphub_email_capture.sql` to the shared Supabase project. The migration creates only `mcphub_*` tables/function and grants function execution to `service_role`.
2. Parent sets **server-only** `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, and a random `MCPHUB_RATE_LIMIT_SECRET` in Vercel. Never use `NEXT_PUBLIC_` for these. Until both migration and env are present, email capture fails visibly and saves nothing.
3. Parent deploys to Vercel and attaches the custom domain. Existing `vercel.json` already specifies the Next.js build; it was not edited. Verify the production email flow with an authorized test address and browser navigation before release.
4. Registry snapshot is static. Refresh it deliberately from the official Registry before claiming newer data. No live health, rating, stars, or independent package audit is included.
5. The original dirty clone path supplied for read-only comparison was absent in this environment, so no changes were copied from it.

## Files and contract changes

- Product UI/API: `app/page.tsx`, `app/directory/page.tsx`, `app/api/email-capture/route.ts`.
- Domain data/config: `lib/types.ts`, `lib/mcps.ts`, `lib/registry.json`, `lib/config-generator.ts`, `lib/saved-configs.ts`.
- Tests: `lib/config-generator.test.ts`, `lib/saved-configs.test.ts`, `tests/mcp-protocol.test.ts`, `tests/fixtures/mcp-server.cjs`; two existing utility tests were converted from `node:test` to the repo's Jest runner so typecheck and test scripts pass.
- App setup: `package.json`, `package-lock.json`, generated `next-env.d.ts`, `supabase/migrations/20261013_mcphub_email_capture.sql`. Existing `vercel.json` is unchanged.
- Deleted obsolete catalog UI components: `components/MCPCard.tsx`, `components/MCPDetailModal.tsx`, `components/SelectionPanel.tsx`.
- Public API change: `POST /api/email-capture` now accepts bounded JSON `{ "email": "..." }` and returns JSON. Success means the database function completed. Previous form POST/redirect semantics are removed. The config generator's TypeScript return contract changed from a string to `{ text, errors, checklist, extension }`; it is internal to this app.

## Curation completion and browser handoff (13 Oct 2026)

The original alphabetical slice was replaced with 53 selected latest active records from the full official Registry search export. Each listing keeps the Registry's exact full name, version, transport, required environment variables or headers, remote URL, and publisher links. The editorial category and reason are explicit. README retrieval and exact npm metadata checks are recorded separately; a retrieved README is not an install test.

All 31 selected stdio npm versions returned exact package metadata; 29 expose a single binary. Publisher README retrieval succeeded for 34 listings. The npm versions for Next DevTools, Brave Search, Tavily, Firecrawl, and Figma Developer have exact single-bin metadata, and their publisher README setup examples were read. Firecrawl requires `FIRECRAWL_API_KEY` for the documented default cloud setup, despite the Registry marking it optional. Brave's documented `--transport stdio` argument is in its export. All other npm exports are blocked until their actual launch syntax and required setup are checked. Five remote URLs (Vercel, Figma, Stripe, Exa, Sentry) match publisher README setup examples and export for Cursor. Other remote URLs are blocked pending publisher setup verification. Required headers remain blocked. This remains metadata/config-schema validation, not connection, package health, security, or third-party install validation.

The parent browser log failed on a global `getByRole('alert')` count. A browser launch here aborted under the sandbox before DOM inspection, so the exact runtime alert text could not be retrieved. Next.js 15.5.27 source at `node_modules/next/dist/client/components/app-router-announcer.js` creates a global `role="alert"` route announcer; the product's export alert is inside `#config`. the browser assertion now scopes there and includes the actual product alert text on failure. The test picks the publisher-documented Next DevTools stdio record instead of the first npm binary. The parent preview on port 3107 may still serve the previous build; restart it after building before rerunning `node tests/browser-smoke.cjs` with the parent's Playwright path.


Publisher README retrieval remained inconclusive for these selected source repositories (sandbox timeouts or API limits). Their exports are blocked unless another setup source was checked; parent can fetch the public URLs before release:

- https://github.com/Azure/containerization-assist
- https://github.com/GLips/Figma-Context-MCP
- https://github.com/M-Pineapple/hubspot-auditor
- https://github.com/YawLabs/redis-mcp
- https://github.com/ai-aviate/better-mcp-notion
- https://github.com/awkoy/notion-mcp-server
- https://github.com/m190/usefulapi-mcp
- https://github.com/mindstone/mcp-servers
- https://github.com/mrfentmen/docker-hub-mcp
- https://github.com/mrfentmen/premium-mcps
- https://github.com/pipeworx-io/mcp-firecrawl
- https://github.com/pipeworx-io/mcp-notion_connect
- https://github.com/pipeworx-io/mcp-replicate
- https://github.com/pipeworx-io/mcp-tavily
- https://github.com/smmallya/ExactPDF

Local checks after this pass: `npm run lint` exit 0; `npm test -- --runInBand` 6 suites and 31 tests passed; `npm run build` exit 0 on Next.js 15.5.27; `npm run typecheck` exit 0; `git diff --check` exit 0. `node tests/browser-smoke.cjs <Playwright path>` reached Chrome launch but Chrome exited with SIGABRT under this sandbox. Parent browser rerun remains required.

No public HTTP API changed in this curation pass. The internal catalog record adds category, reason, provenance, npm metadata status, and launch verification fields. The generator now blocks npm entries and remote URLs without verified launch or setup evidence.

## Email quota correctness follow-up (13 Oct 2026)

Vercel's [request header documentation](https://vercel.com/docs/headers/request-headers) says it overwrites `x-forwarded-for` to prevent spoofing and that `x-vercel-forwarded-for` carries the same client IP. The endpoint accepts a single valid IPv4 or IPv6 value from `x-vercel-forwarded-for` on direct Vercel deployments. It does not use caller-supplied proxy-header fallbacks or a shared `unknown` quota key. If the Vercel header is missing or malformed, `POST /api/email-capture` returns 503 with `Email updates are temporarily unavailable. Please try later.` before creating a Supabase client. A failed request is not saved. This requires a direct Vercel-domain live check by the parent; a custom proxy in front of Vercel can change the effective client IP.

The route tests cover distinct IPs yielding distinct quota keys, repeated IPs yielding the same key, and missing/invalid headers failing before database access. The browser smoke selects two more records with a fresh unchecked locator each time, then clicks a fourth and asserts the refusal and three checked records. Parent must restart the port 3107 preview and rerun the full browser script outside this sandbox.

Follow-up checks: `npm run typecheck` exit 0; `npm run lint` exit 0; `npm test -- --runInBand` 7 suites and 36 tests passed; `npm run build` exit 0 on Next.js 15.5.27; `node --check tests/browser-smoke.cjs` exit 0; nested-repo `git diff --check` exit 0. The full browser script remains for the parent's restarted preview.
