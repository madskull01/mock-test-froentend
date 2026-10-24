# React + Vite

## Google sign-in

Create an OAuth 2.0 client ID of type **Web application** in Google Cloud
Console and add the app's development and production origins to its authorized
JavaScript origins (for local Vite development, `http://localhost:5173`).
Google Identity Services returns an ID token to the frontend; the backend
validates its signature, issuer, audience, expiration, and verified email before
creating a cdacmocktest session.

Set the same web client ID in both places:

- Backend environment: `GOOGLE_CLIENT_ID`
- Frontend environment: `VITE_GOOGLE_CLIENT_ID` (copy
  `.env.example` to `.env.local`)

The production frontend client ID is configured in `.env.production`. The
Google web client must have the deployed site's exact origin,
`https://profound-dolphin-979043.netlify.app`, in its authorized JavaScript
origins. The client ID is public browser configuration; never put the client
secret in a frontend file.

The repository-root `.env` is read by the backend, not by Vite. The frontend
must have its own `.env.local`; never put `GOOGLE_CLIENT_SECRET` in a frontend
environment file. This Google Identity Services ID-token flow does not use the
client secret or a redirect URI. Add the exact frontend origin you use to the
OAuth client's authorized JavaScript origins. For the current local browser
URL, that is `http://127.0.0.1:5190` (origins using `localhost` are distinct).
Restart both servers after changing environment values.

## Local backend

For local development, leave `VITE_API_BASE_URL` unset. Vite proxies API and
uploaded-image requests to the backend at `http://localhost:8080`. If you open
the hosted Netlify frontend while running the backend locally on the same
computer, add the exact Netlify origin (without a trailing slash) to the
backend's `CORS_ALLOWED_ORIGINS`. This only makes requests possible from that
computer; other Netlify visitors cannot access your local backend.

## Subject sections

Active subjects are grouped by their assigned Section A, Section B, or Section C
on the landing page and in the test-library filters. On backend startup, an
empty section catalog is initialized with all three groups. The existing
single-section catalog named `Aptitude` is migrated to Section A, preserving
its subjects; Sections B and C are then created for future subjects. Other
custom section catalogs are left unchanged.

## SEO and Google Search Console

The public site is currently a client-rendered React single-page application.
The homepage is the only standalone public URL; section and FAQ links are
in-page anchors, while tests, sign-in, and student results are not separate
indexable routes. The static `index.html` provides the homepage title,
description, canonical URL, social metadata, and WebSite JSON-LD before React
loads. Google can render JavaScript, but client rendering can delay or limit
content discovery compared with server-rendered HTML. If Search Console shows
that important visible homepage content is missing from the rendered page,
evaluate a lightweight prerendering approach before considering a framework
migration.

The static public crawl files are:

- `public/robots.txt` — permits crawling and references the sitemap.
- `public/sitemap.xml` — lists only the canonical homepage,
  `https://cdacmocktest.com/`.
- `public/favicon-48x48.png` — square site icon referenced in the HTML head.

After deploying frontend changes:

1. Verify `cdacmocktest.com` as a **Domain property** in Google Search Console
   using the DNS TXT record Google provides. Do not commit the verification
   token to this repository.
2. Submit `https://cdacmocktest.com/sitemap.xml` under **Sitemaps**.
3. Use **URL inspection** for `https://cdacmocktest.com/`, run a live test, and
   request indexing after confirming the rendered page is correct.
4. Check **Pages / Indexing** for crawl or indexing issues and inspect the
   rendered HTML when Google reports missing content.
5. In **Performance → Search results**, review queries, impressions, clicks,
   click-through rate, and average position. Compare equivalent date ranges;
   improve titles and descriptions where impressions are high but click-through
   rate is low.

The live HTTP and `www` host variants should resolve to the canonical HTTPS
homepage. Confirm those redirects again after any hosting or domain change.
Search rankings and indexing speed are controlled by Google and cannot be
guaranteed by metadata or structured data.

### Suggested 30-day follow-up

- **Week 1:** deploy, verify the domain property, submit the sitemap, inspect
  the homepage and favicon.
- **Week 2:** review indexing reports and fix any fetch, rendering, or
  canonicalization errors.
- **Week 3:** review real search queries and update visible content only where
  it improves accuracy and usefulness for candidates.
- **Week 4:** compare impressions, clicks, and click-through rate with the
  initial period; prioritize the next content improvements from actual query
  data. Add new sitemap URLs only when genuine public pages exist.

Do not add separate keyword-targeted URLs until the application has real,
useful public pages with stable routes and content available without signing
in.

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

## SnapDeploy backend

Deploy the backend's `mocktest` folder as a native Java 21 service on SnapDeploy.
The production build defaults to
`https://mocktest-backend-26c22.containers.snapdeploy.app`. If the service URL
changes, update Netlify's `VITE_API_BASE_URL` to the new HTTPS URL without a
trailing slash, then redeploy the Netlify site. Configure the backend's
`CORS_ALLOWED_ORIGINS` with the exact Netlify and custom-domain origins. Keep
database credentials and all other backend secrets in SnapDeploy, not in this
frontend or its environment files. See the backend `HELP.md` for the build and
start commands.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
