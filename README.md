# CPSU Planning and Development Office Information Hub

Web-based institutional information and document repository for the Central Philippines State University Planning and Development Office.

## Technology

- React, Vite, and TypeScript
- Tailwind CSS
- React Router and TanStack Query
- Zod validation
- Vercel server APIs
- Firebase Authentication for administrators
- Cloudflare R2 for repository files

Version 1 does not use a traditional database. Repository metadata is derived from R2 object keys, object properties, and stable application category configuration.

## Development

```bash
npm install
npm run dev
```

Available validation commands:

```bash
npm test
npm run typecheck
npm run lint
npm run build
```

## Cloudflare R2 configuration

Copy `.env.example` to `.env.local` and populate the server-only values:

```text
R2_ACCOUNT_ID=
R2_ACCESS_KEY_ID=
R2_SECRET_ACCESS_KEY=
R2_BUCKET_NAME=
R2_AUDIT_BUCKET_NAME=
R2_ENDPOINT=
R2_PUBLIC_BASE_URL=
```

Create an R2 API token with **Object Read & Write** permission and scope it only to the repository bucket and a separate private audit bucket. `R2_AUDIT_BUCKET_NAME` must refer to that private bucket. Do not enable an `r2.dev` URL or public custom domain for the audit bucket. The default S3-compatible endpoint is:

```text
https://<R2_ACCOUNT_ID>.r2.cloudflarestorage.com
```

`R2_ENDPOINT` is optional and should be used for jurisdiction-specific endpoints when required. Production R2 URLs must use HTTPS. Plain HTTP is accepted only for a local development endpoint. `R2_PUBLIC_BASE_URL` should use a Cloudflare custom domain in production. An `r2.dev` URL is suitable only for development.

These values are server-only. Never rename them with a `VITE_` prefix, commit `.env` files, or expose the R2 secret key to browser code.

## Repository object keys

Objects must follow this convention:

```text
section/category/[optional-subcategory/...]/year/filename.ext
```

Examples:

```text
statistical-profile/student-population/2026/student-population-2026.xlsx
higher-education-performance/accreditation/undergraduate/2026/accreditation-report-2026.pdf
```

Supported extensions are `.pdf`, `.xlsx`, `.jpg`, `.jpeg`, `.png`, and `.webp`.

## Architecture boundary

```text
React client -> GET /api/resources -> Vercel server API -> Cloudflare R2
```

The browser never communicates with the authenticated R2 S3 API and never receives R2 credentials. Public resource URLs are derived only from the configured public bucket domain.

## Firebase administrator authentication

Create a Firebase web app, enable **Email/Password** under Authentication providers, and add an authorized Planning and Development Office user in the Firebase Console. Add the web app's public client configuration to `.env.local`:

```text
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_APP_ID=
```

Restart the development server after changing environment variables, then open `/admin/login`. Administrator accounts are provisioned in Firebase Console; the public application does not provide registration.

Client-side route protection improves the interface but is not the authorization boundary for repository mutations. Every future protected server API must independently verify the Firebase ID token before accessing Cloudflare R2.

## Firebase Admin token verification

The protected `GET /api/admin/session` endpoint verifies Firebase ID tokens with the server-only Firebase Admin SDK. In Firebase Console, open **Project settings → Service accounts**, generate a new private key, and copy only the required JSON values into `.env.local`:

```text
FIREBASE_ADMIN_PROJECT_ID=<service-account project_id>
FIREBASE_ADMIN_CLIENT_EMAIL=<service-account client_email>
FIREBASE_ADMIN_PRIVATE_KEY=<service-account private_key with line breaks encoded as \n>
FIREBASE_BOOTSTRAP_ADMIN_UID=<initial administrator Firebase UID>
```

Never commit the downloaded service-account JSON file, place it under `src/` or `public/`, or prefix these variables with `VITE_`. Restart the local development server after configuring them. For Vercel, add the same three values as encrypted project environment variables.

The browser sends the current user's Firebase ID token in the standard `Authorization: Bearer <token>` header. The protected API verifies its signature, expiration, project audience, revocation status, and administrator permission before returning the administrator identity.

For the first administrator, open **Firebase Console → Authentication → Users**, select the existing staff account, and copy its **User UID** into `FIREBASE_BOOTSTRAP_ADMIN_UID`. This value is server-only and must also be added to the Vercel environment. The administrator then signs in normally with email and password—there is no separate claim command or browser-side authorization process.

The configured UID is the secure bootstrap account. Additional accounts created from the protected **Staff access** page receive administrator permission automatically. Never use an email address or a client-side flag as the authorization boundary.

## Administrator resource inventory

Authenticated administrators can open `/admin/resources` to review the live repository inventory. The page requests `GET /api/admin/resources` with the current Firebase ID token. The server verifies the token before reading Cloudflare R2, then applies the same validated search, section, file-type, sorting, and pagination contract used by the public repository.

This inventory is intentionally read-only. Upload, replacement, rename, and deletion remain unavailable until their separately authenticated server APIs and validation rules are implemented.

## Administrator uploads

`/admin/resources/upload` accepts one PDF, JPG, PNG, or WebP file up to 25 MB. Excel resources already present in the repository remain available for browsing and download, but new XLSX uploads are rejected. The protected server validates the Firebase identity and upload metadata, derives a safe `section/category/year/filename` key, rejects duplicates, and returns a five-minute presigned PUT URL. The browser uploads directly to R2 without receiving R2 credentials.

The R2 API token must have **Object Read & Write** access to the repository and private audit buckets. Configure the public repository bucket CORS policy to allow `PUT` from the exact local and production application origins and to allow the `Content-Type` and `If-None-Match` headers. Do not use a wildcard production origin. Upload authorizations sign `If-None-Match: *`, so R2 rejects a concurrent upload instead of silently overwriting an existing key.

After the direct PUT succeeds, the client calls the protected upload-completion endpoint. The server reads the actual R2 object properties and verifies its key, content length, content type, and upload timestamp before the UI reports success.

Public resource rows provide native browser PDF previews and direct image previews. Legacy non-previewable resources remain available through a generic file row and download action, without a dedicated visualization or preview prompt.

## Deployment security

`vercel.json` applies a Content Security Policy, clickjacking protection, MIME-sniffing protection, a strict referrer policy, a restricted permissions policy, and HSTS. Verify these response headers after every production deployment. HTTPS is mandatory for both the application and its configured R2 endpoints.

Administrator mutations write immutable JSON audit events to the private audit bucket using create-only R2 writes. These records include the administrator UID, action, target, timestamp, and non-sensitive action details. They never include passwords, Firebase tokens, or R2 credentials.
