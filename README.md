# AngularMart — Modern Angular 17 E‑commerce

A polished, full‑stack‑ready e‑commerce front‑end built with Angular 17’s standalone components, signals, and new control flow. It showcases a realistic product catalog, guarded auth, a slick cart drawer, and a demo checkout — all wrapped in a cohesive dark theme.

This is the kind of app you can ship as an internship showcase: it demonstrates good UX, modern Angular patterns, and thoughtful engineering choices.


## Highlights

- Angular 17 standalone components and new `@if/@for` control flow
- Signals for state (auth, cart, UI), OnPush where it counts
- Auth flow with access/refresh token interceptors and guards
- User‑scoped cart persistence (cart switched/cleared on login/logout)
- Product catalog with filters (All/Deals/Trending/New) and dark, consistent cards
- Cart drawer: keyboard/escape/backdrop close, precise currency math, line totals
- Checkout page with reactive‑form validation and shipping options
- Clean navigation with active states and a tidy, accessible navbar


## Quick Start

- Requirements: Node 18+, npm 9+, Angular CLI 17+

```bash
npm install -g @angular/cli
npm install
npm start        # ng serve --open
```

Config lives in `src/environments/environment.ts` — by default this targets `https://dummyjson.com` for products and auth.


## Project Tour

- App entry
  - `src/main.ts`, `src/app/app.routes.ts` (standalone routing)
  - `src/app/app.config.ts` (interceptors, providers)
- Layout
  - `src/app/layout/navbar/` main navbar with cart badge + drawer trigger
  - `src/app/layout/auth-navbar/` lightweight navbar for login/register
  - `src/app/layout/footer/` footer component
- Core
  - `src/app/core/services/` API, Auth, Cart services
  - `src/app/core/interceptors/` auth + refresh token handling
  - `src/app/core/guards/` guest/auth guards
- Pages
  - Home, All Products, Categories, Category Page, Product Detail
  - Auth (Login, Register), Checkout, and NotFound (404)
- Shared
  - `product-card/`, `stars/`, `notfound/`

A few key routes:

- `/home` — landing page with featured sections
- `/all-products?view=(all|deals|trending|new)` — product explorer
- `/categories/:cat` — category slice
- `/products/:id` — detail page
- `/auth/(login|register)` — guest‑only auth pages
- `/checkout` — demo checkout (from the cart drawer)


## Architecture & Decisions

- Standalone + Signals
  - Every component is standalone; global state uses signals.
  - Signals are used for `cart`, `auth.user`, `isLoading`, etc.
  - Heavier pages use `ChangeDetectionStrategy.OnPush`.

- New Control Flow
  - `@if/@for` keeps templates clean and efficient.

- Auth
  - Access and refresh tokens stored by `AuthService`.
  - `AuthInterceptor` attaches access token; `RefreshInterceptor` attempts silent refresh.
  - Guards: guest‑only auth pages; redirect with `?redirect=` when needed.

- Cart (User‑scoped persistence)
  - In‑memory cart is a signal; persisted in `localStorage` under `cart:user:<id|username>`.
  - On logout, cart is cleared; on user switch, we load the corresponding cart.
  - Subtotal uses integer‑cents math to avoid float artifacts.

- Styling
  - Tailwind (dark theme), a few utility classes, and Font Awesome for icons.
  - Buttons and inputs are consistent across pages; nav links expose active/hover states.

- Accessibility
  - Cart badge has a screen‑reader count, tabs use proper roles/aria.
  - Focus outline preserved on controls; drawer closes on ESC/backdrop.


## Data Layer

- Environment API: `src/environments/environment.ts`
- Example endpoints (DummyJSON compatible):
  - `GET /products`, `GET /products/:id`, `GET /products/category/:slug`
  - `POST /auth/login { username, password }`
  - `GET /auth/me` (profile)

`ApiService` wraps HTTP + mapping to ergonomics in the app. Errors surface to pages as friendly messages.


## Development

- Scripts

```bash
npm start        # dev server (ng serve)
npm run build    # production build (ng build)
npm test         # unit tests (ng test)
```

- Recommended workflow
  - Keep components standalone, co‑locate template and minimal CSS.
  - Prefer signals for app state; favor OnPush for expensive pages.
  - Reuse shared pieces like `product-card` consistently.

- Formatting & Linting
  - Follow project conventions; Tailwind utility classes preferred for layout.
  - Use meaningful names; avoid one‑letter variables in shared code.


## Testing (suggested)

- Unit tests for `CartService` (add/remove/update, user switch, persistence key logic)
- Auth interceptors happy path + refresh fallback
- Simple component tests: product card rendering; checkout validation behavior


## Screens (suggested for README images)

- Home — featured sections, trending, new, deals
- All Products — tabs: All, Deals, Trending, New
- Product Detail — gallery, rating, add to cart
- Cart Drawer — line totals, disabled checkout hint
- Checkout — shipping, payment, validation
- Auth — login/register with disabled/active navbar buttons

Add PNGs under `docs/screens/` and embed here when ready.


## Roadmap

- Merge guest cart into account on login (opt‑in)
- Sorting & filters (price, rating, brand), pagination/infinite scroll
- Skeleton loaders for product pages
- Keyboard focus trap inside the cart drawer; add unit tests
- Deployment recipe (Vercel/Netlify); small analytics hooks


## How to Review (for internship reviewers)

- Skim the dark‑themed UI: consistent buttons, inputs, and nav states.
- Confirm Angular 17 usage: standalone components, signals, `@if/@for`.
- Inspect `CartService`: user‑scoped persistence + float‑safe currency.
- Check `AuthInterceptor`/`RefreshInterceptor` and the guards.
- Verify UX details: disabled checkout when empty/invalid, line totals, active tabs.

If you want a quick technical walkthrough or a small screencast script, see `docs/` (add a short Loom/GIF link).


---

If you have questions or want a deeper tour of any part of the codebase (auth flow, interceptors, cart signals, or styling), open an issue or ping me — happy to walk through the decisions.

