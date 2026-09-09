# Mecánicos Biker — Next.js

Rebuild of the Mecánicos Biker site (see `../mecanicos-biker/` for the original static version) using Next.js, React and Framer Motion, with an Apple-inspired visual style and scroll animations.

## Stack

- Next.js 16 (App Router, Turbopack)
- Tailwind CSS v4
- Framer Motion (`motion`)

## Development

```bash
npm install
npm run dev
```

## Validate

```bash
npm run build   # production build + typecheck
npx eslint .
npx playwright test
```
