# Project memory

## Product intent & audience

- Next.js application using Prisma as its ORM; specific product domain and audience not yet identified.

## Brand personality & voice

- Not yet inferred from available context.

## Visual design & UX direction

- Not yet inferred from available context.

## Decisions, constraints & rationale

- Framework: Next.js 16; ORM: Prisma (client must be generated for preview to start).
- Environment constraint: long-running processes (e.g., `npm run dev`) are blocked; Bolt's preview runs automatically and cannot be started manually.
- Turbopack is the default bundler in Next.js 16 but crashes on this platform because native bindings are unavailable.
- Fix applied: added `--webpack` flag to both `dev` and `build` scripts in `package.json` to force Webpack instead of Turbopack.
- `.next` cache was cleared after the script change.
- Build confirmed to succeed with Webpack.
- Preview may require a hard-refresh (Cmd/Ctrl+Shift+R) or toggling Code/Preview views to re-read the updated `package.json` scripts.

## Open questions & assumptions

- Assuming the `--webpack` flag in `package.json` scripts is sufficient for the preview system to avoid Turbopack.
- Whether the preview system fully respects the `dev` script override or still invokes `npx next dev` directly is unconfirmed.
- Product purpose, target users, visual design, and brand voice remain unknown.