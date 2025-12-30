## Quick orientation for AI coding agents

This repository is a React app bootstrapped for Vite. The goal of this file is to point an AI agent to the exact patterns, conventions, and integration points that matter when making changes.

- Project entry and build
  - Dev: `npm run dev` (runs `vite`). Build: `npm run build`. Lint: `npm run lint`.
  - Main entry: `src/main.jsx` -> renders `src/App.jsx`.

- Architecture / big-picture
  - Single-page React app (Vite + React). Routing is centralized in `src/App.jsx` (React Router). Pages live in `src/pages/*` and are mounted by `App.jsx` Routes.
  - Global auth state is provided by `src/context/AuthContext.jsx`. Components obtain user/login/logout via `useAuth()`.
  - Server communication happens through the `src/services` folder. `src/services/api.js` creates an Axios instance with interceptors; other files (e.g. `authApi.js`, `userApi.js`, `courseApi.js`) wrap endpoints and localStorage token handling.

- Key integration points and conventions
  - Base API URL is configured in `src/services/api.js` as `http://localhost:5000/api` by default. Expect backend under `/api/*` routes.
  - Authentication token is stored in `localStorage` under `token`. Axios request interceptor attaches `Authorization: Bearer <token>`.
  - Axios response interceptor converts error responses into a string message and clears token on 401.
  - Use service wrappers in `src/services/*` for any network calls (do not call axios directly in components unless for quick prototyping).

- Routing & authorization
  - Public routes are defined in `App.jsx`. Protected routes use `components/ProtectedRoute.jsx` and `AuthContext` (Admin routes pass `adminOnly={true}`).

- Naming & file conventions
  - JSX files use `.jsx` extension. Services are plain `.js` modules (see `src/services/indexApi.js` which exports the service modules).
  - Comments and some UI strings are in Hebrew — preserve Hebrew text when editing UI copy unless asked to translate.
  - The project is ESM (`"type": "module"` in package.json).

- Patterns the agent should follow when making edits
  - Prefer adding/updating logic in `src/services/*` for API changes and in `src/context/*` for auth/state changes.
  - Update exports in `src/services/indexApi.js` if you add a new service and reference that index from other modules.
  - Keep UI updates inside `src/components/*` and `src/pages/*`. Reuse existing small components (e.g. `Header`, `ProtectedRoute`).

- Caution / notable inconsistencies found
  - `src/services/indexApi.js` exports named defaults like `authAPI`, `userAPI`, etc. However, `src/App.jsx` contains an import statement `import { AuthApi, PhotosApi, AlbumsApi, UserApi } from './services/index.js'` which does not match the existing file name or export names. If you modify imports/exports, update consumers accordingly.

- Examples (copy-paste patterns)
  - Token injection (already implemented): `src/services/api.js` interceptor reads `localStorage.getItem('token')` and sets `config.headers.Authorization = \`Bearer ${token}\``.
  - Auth wrapper call: `await authAPI.login({ email, password })` (see `src/services/authApi.js`). When a login returns a token the service saves it into `localStorage`.

- Developer workflows (how to build / run / lint)
  - Start dev server: `npm run dev` (Vite with HMR)
  - Build for production: `npm run build`
  - Linting: `npm run lint` (ESLint is configured in repo root)

If any of the above assumptions are incomplete or you want the agent to perform code edits (e.g., rename `indexApi.js` -> `index.js` or fix import mismatches), tell me which files to update and whether you'd like safe automated edits or a PR-style set of changes.

---
If you want, I can now:
1. Create a small checklist of low-risk improvements (fix the index import mismatch, add README note about backend port, add a short test harness), or
2. Directly open a PR that implements one of the small fixes above.

Please indicate which next step you prefer or provide any missing constraints (e.g., backend URL, desired language for UI copy).
