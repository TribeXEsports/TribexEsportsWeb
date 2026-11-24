# Project memory

## Product intent & audience

- Next.js application using Prisma as its ORM; specific product domain and audience not yet identified.

## Brand personality & voice

- Not yet inferred from available context.

## Visual design & UX direction

- Not yet inferred from available context.

## Decisions, constraints & rationale

- Framework: Next.js.
- ORM: Prisma; Prisma client must be generated for the preview to start successfully.
- Environment constraint: long-running processes (e.g., `npm run dev`) are blocked; Bolt's preview runs automatically and cannot be started manually from the assistant.
- No build errors were detected in this turn; preview is expected to come up on its own.

## Open questions & assumptions

- Assuming the Prisma client generation step is sufficient for a clean preview startup.
- Product purpose, target users, visual design, and brand voice remain unknown.
- Whether the user is still experiencing a preview issue or it has resolved is unconfirmed.