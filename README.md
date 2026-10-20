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

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
