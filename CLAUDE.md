# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # Start development server at http://localhost:3000
npm run build    # Production build
npm run lint     # Run ESLint
```

There is no test runner configured.

## Stack

- **Next.js 16** with the App Router (`src/app/`)
- **React 19**
- **TypeScript** with strict mode enabled
- **Tailwind CSS v4** (via `@tailwindcss/postcss`)

## Code Generation Guidelines
IMPORTANT: Before generating any code, always first check the `/docs` directory for relevant documentation files and follow the guidance found there.

- /docs/ui.md

## Architecture

This is a fresh `create-next-app` scaffold — no application logic has been built yet. The entry point is `src/app/page.tsx` and the root layout (fonts, global CSS) lives in `src/app/layout.tsx`.

The `@/*` path alias maps to `./src/*`.
