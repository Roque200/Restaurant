# Mecánicos Biker — Next.js

Rebuild of the Mecánicos Biker site (see `../mecanicos-biker/` for the original static version) using Next.js, React and Framer Motion, with an Apple-inspired visual style and scroll animations. Includes a real SQLite-backed admin panel, QR-code appointment check-in, and optional Mercado Pago online checkout.

## Stack

- Next.js 16 (App Router, Turbopack, Server Actions)
- Tailwind CSS v4
- Framer Motion (`motion`)
- SQLite via `better-sqlite3` — a single file at `data/mecanicos-biker.db`, created and seeded automatically on first run. No external database service to set up.
- `qrcode` to generate the appointment QR codes, `html5-qrcode` for the admin's camera scanner.
- `mercadopago` (Checkout Pro) for optional online payments in the store.

## How data works

Everything that used to be mock arrays (`admin-data.ts`) now lives in SQLite (`src/lib/db.ts`): products, appointments, orders and customers. All reads/writes on the public site and the admin panel go through this same database, so:

- Booking an appointment on the public calendar creates a real row and blocks that exact slot for everyone else.
- Buying a product decrements its stock; cancelling an order restores it.
- Editing a product in the admin panel changes what shoppers see immediately.

The database file is gitignored and rebuilt from a small seed on first boot — delete `data/` to reset to a clean demo state.

## QR check-in

Booking an appointment generates a QR code (and a shareable `/cita/<token>` link) shown to the customer right away and included in their WhatsApp confirmation message. At `/admin/escanear`, staff can scan that code with the device camera (or type/paste the code manually) to see the appointment and mark the customer as arrived.

## Online payments (Mercado Pago)

The store's "Pagar en línea" button only appears once `MERCADOPAGO_ACCESS_TOKEN` is set — see `.env.example`. Without it, checkout falls back to the WhatsApp flow only, and nothing breaks. To enable it:

1. Create a Mercado Pago developer account and grab an Access Token (start with the **test** one) at https://www.mercadopago.com.mx/developers/panel.
2. Put it in `.env.local` as `MERCADOPAGO_ACCESS_TOKEN=...`.
3. Mercado Pago redirects back to `/pedido/<id>` after payment and calls `/api/mercadopago/webhook` to confirm it — both are already wired up.

## Development

```bash
npm install
npm run dev
```

## Validate

```bash
npm run build   # production build + typecheck
npx eslint .
npx playwright test   # starts from a fresh seeded database every run
```
