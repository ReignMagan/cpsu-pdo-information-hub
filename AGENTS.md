# AGENTS.md

# CPSU Planning and Development Office Information Hub

## AI Development Rules, Architecture Contract, and Project Conventions

This file defines the mandatory development rules for the **CPSU Planning and Development Office Information Hub**.

All AI coding agents, automated development tools, and developers working on this repository must follow this document unless an explicit project decision overrides it.

This file is an architecture contract.

Do not silently change major architectural decisions.

---

# 1. Project Identity

## Project Name

**CPSU Planning and Development Office Information Hub**

## Project Type

Web-based institutional information and document repository.

## Institution

Central Philippines State University
Planning and Development Office

## Primary Purpose

The application provides a centralized repository where authorized Planning and Development Office personnel can securely manage institutional resources while public visitors can browse, preview, search, filter, and download publicly available files.

The repository primarily supports:

* PDF documents
* Excel `.xlsx` files
* Images

  * `.jpg`
  * `.jpeg`
  * `.png`
  * `.webp`

---

# 2. Core Architecture Contract

The baseline architecture is:

```text
React + Vite + TypeScript
        │
        ▼
      Vercel
   ┌────┴─────┐
   │          │
   ▼          ▼
Frontend   Server APIs
              │
       ┌──────┴───────┐
       │              │
       ▼              ▼
 Firebase Auth    Cloudflare R2
 Admin Identity   File Repository
```

The responsibilities are strictly separated.

## Firebase Authentication

Firebase is responsible for:

```text
Administrator authentication
Administrator sessions
Firebase ID tokens
```

Firebase must NOT be used for:

```text
Firestore
Repository database
File storage
Application metadata database
```

unless the architecture is explicitly changed in the future.

---

## Cloudflare R2

Cloudflare R2 is responsible for:

```text
PDF storage
XLSX storage
Image storage
Repository object organization
Repository object metadata where necessary
```

Cloudflare R2 is the primary live file repository.

---

## Vercel

Vercel is responsible for:

```text
Frontend hosting
HTTPS
Deployment
Environment variables
Secure server-side APIs
Communication with Cloudflare R2
Authentication verification for protected operations
```

---

## React Application

React is responsible for:

```text
Public website
Repository browser
Search and filtering UI
File previews
Administrator interface
Authentication interface
Client-side state
Forms
User experience
```

---

# 3. No Traditional Database

Version 1 deliberately uses:

```text
NO PostgreSQL
NO MySQL
NO MongoDB
NO Supabase Database
NO Firestore
```

Do not introduce a database because it appears easier for a particular feature.

Repository organization should initially come from:

```text
R2 object keys
R2 prefixes
Filenames
Object metadata where necessary
Application-defined category configuration
```

If a future requirement genuinely cannot be implemented safely or maintainably without a database, document the limitation and propose an architectural change before implementing one.

Never silently add a database.

---

# 4. Architecture-First Development Rule

This project follows:

**Architecture-first, brick-by-brick development.**

Do not build large portions of the system simultaneously.

Each development brick must:

1. Have one clear objective.
2. Have a clearly defined scope.
3. Be implemented completely.
4. Be tested.
5. Pass TypeScript validation.
6. Pass linting.
7. Preserve existing architecture.
8. Work before the next brick begins.

Avoid speculative features.

Avoid premature abstractions.

Avoid large rewrites without a demonstrated need.

---

# 5. Version 1 Scope

Version 1 should remain focused.

Required areas include:

```text
Public website
Repository browsing
Repository search
Repository filtering
PDF resources
XLSX resources
Image resources
Administrator login
Administrator dashboard
Upload
Replace
Rename where supported
Delete
Download
Image preview
PDF preview
Repository organization
Security
Accessibility
Deployment
Documentation
```

Do not expand Version 1 unnecessarily.

---

# 6. Features Explicitly Outside Version 1

Do not implement the following unless specifically requested:

```text
Public user accounts
Comments
Likes
Social feeds
Chat
Firestore
SQL database
Online spreadsheet editing
Collaborative document editing
AI features
Push notifications
Complex analytics
Advanced approval workflows
File versioning
Bulk uploads
ZIP downloads
Institutional SSO
OCR
Automated document extraction
```

These are possible future enhancements, not current requirements.

---

# 7. User Roles

The system contains two primary user roles.

---

## 7.1 Public Guest

No account is required.

Guests may:

```text
Visit the website
Browse repository sections
Browse categories
Search resources
Filter resources
Sort resources
Preview supported resources
View images
Open PDFs
Download files
Access public institutional information
```

Guests must NOT be able to:

```text
Upload
Delete
Replace
Rename
Modify categories
Modify repository structure
Access administrator pages
Call protected administrator operations successfully
```

---

## 7.2 Administrator

Administrators authenticate through Firebase Authentication.

Administrators may:

```text
Log in
Log out
Access protected admin pages
View repository information
Upload resources
Choose repository categories
Choose resource year
Upload PDF files
Upload XLSX files
Upload supported images
Replace resources
Rename resources when supported
Delete resources
Review repository content
```

Administrator accounts should only be issued to authorized CPSU Planning and Development Office personnel.

---

# 8. Technology Stack

The approved frontend stack is:

```text
React
Vite
TypeScript
Tailwind CSS
shadcn/ui
React Router
TanStack Query
React Hook Form
Zod
Lucide React
```

Supporting libraries may be added when justified.

Do not add libraries merely to avoid writing a small amount of straightforward code.

Before adding a dependency, consider:

```text
Is it maintained?
Is it necessary?
Does it duplicate an existing dependency?
Does it significantly improve maintainability?
Does it increase bundle size unnecessarily?
Is it appropriate for a long-lived institutional project?
```

Prefer stable and widely maintained packages.

---

# 9. Codebase Architecture

The project should use a stable feature-based architecture.

Target conceptual organization:

```text
src/
│
├── app/
├── assets/
├── components/
├── features/
├── layouts/
├── lib/
├── pages/
├── routes/
├── services/
├── types/
└── utils/
```

Feature-specific implementation should live inside `features/` where appropriate.

Example:

```text
src/
└── features/
    ├── auth/
    ├── repository/
    ├── resources/
    └── admin/
```

The exact folder structure should be finalized during the architecture phase.

Once finalized, do not casually move files between architectural layers.

---

# 10. Separation of Concerns

Keep responsibilities clearly separated.

## Components

Components should primarily handle:

```text
Rendering
User interaction
Composition
Presentation
```

Components should not contain direct R2 credential handling or privileged server logic.

---

## Pages

Pages compose larger features for specific routes.

Pages should avoid becoming giant application controllers.

---

## Features

Feature folders contain domain-specific logic.

Examples:

```text
auth
repository
resources
admin
```

---

## Services

Services handle external system communication.

Examples:

```text
Firebase
Repository API
Resource API
Authentication API helpers
```

---

## Lib

Use `lib/` for foundational integrations and shared configuration.

Examples:

```text
Firebase client configuration
Query client
Shared utility configuration
```

---

## Types

Shared TypeScript domain definitions belong in appropriate type modules.

Avoid redefining the same resource interface in multiple files.

---

## Utils

Utilities should be:

```text
Pure where practical
Small
Reusable
Domain-neutral where possible
Easy to test
```

---

# 11. Routing Rules

Use React Router.

Public and administrator routes must remain clearly separated.

Expected routes include:

```text
/

/repository

/statistical-profile

/higher-education-performance

/research-extension

/financial-performance

/about

/contact
```

Administrator routes may include:

```text
/admin/login

/admin

/admin/resources

/admin/resources/upload

/admin/categories

/admin/settings
```

The exact final route structure may evolve, but public and admin responsibilities must remain separated.

---

# 12. Protected Route Rules

A hidden button is not security.

A protected React route is not sufficient server-side security.

Protected administrator pages must check authentication state.

Protected APIs must independently verify authentication server-side.

Correct flow:

```text
Administrator
      │
      ▼
Firebase Authentication
      │
      ▼
Firebase ID Token
      │
      ▼
Protected API
      │
      ▼
Verify token
      │
      ▼
Authorize operation
      │
      ▼
Cloudflare R2
```

Never trust a client-side `isAdmin` boolean as authorization.

---

# 13. Firebase Rules

Firebase is used only for authentication in Version 1.

Initially use:

```text
Email + Password
```

Frontend Firebase configuration may use the normal Firebase public client configuration.

Sensitive server credentials must never be exposed through frontend environment variables.

Authentication code should have clear boundaries.

Do not scatter Firebase calls throughout unrelated UI components.

Prefer centralized authentication utilities, hooks, or context.

---

# 14. Cloudflare R2 Security Rules

Cloudflare R2 secret credentials must NEVER be exposed to the browser.

Never place these in client-side code:

```text
R2 access key
R2 secret key
Private R2 credentials
Server-only signing credentials
```

Never create frontend variables such as:

```text
VITE_R2_SECRET_KEY
VITE_R2_ACCESS_KEY
```

Anything beginning with `VITE_` can become visible to client-side code.

Privileged R2 operations must occur through trusted server-side infrastructure.

---

# 15. Repository Access Pattern

Preferred architecture:

```text
React
   │
   ▼
Repository API
   │
   ▼
Cloudflare R2
```

For protected administrative actions:

```text
React Admin UI
      │
      ▼
Firebase ID Token
      │
      ▼
Vercel API
      │
      ├── Verify token
      ├── Validate request
      ├── Authorize action
      │
      ▼
Cloudflare R2
```

---

# 16. File Upload Strategy

The upload system must not expose R2 secrets.

The eventual implementation should prefer a secure upload architecture suitable for serverless hosting.

A suitable flow is:

```text
Administrator
      │
      ▼
Select file
      │
      ▼
Client validation
      │
      ▼
Request authenticated upload authorization
      │
      ▼
Server verifies Firebase ID token
      │
      ▼
Server validates requested object information
      │
      ▼
Server generates temporary upload authorization
      │
      ▼
Browser securely uploads file
      │
      ▼
Cloudflare R2
```

If presigned upload URLs are used, ensure:

```text
Short expiration time
Restricted object key
Restricted operation
Validated content information
Authenticated request
```

---

# 17. Allowed File Types

Version 1 accepts:

```text
.pdf
.xlsx
.jpg
.jpeg
.png
.webp
```

Optional future types include:

```text
.xls
.docx
.pptx
```

Do not enable optional types without updating validation and preview/download behavior.

---

# 18. File Validation

Validate uploads on both the client and server where applicable.

Do not rely solely on filename extensions.

Validation should consider:

```text
Extension
MIME type
File size
Filename
Requested category
Requested year
Object key
Authentication
```

Initial application-level maximum file size:

```text
25 MB per file
```

Treat this value as configurable.

---

# 19. Filename Security

Uploaded filenames must be sanitized before being used in object keys.

Reject or normalize unsafe input.

Prevent:

```text
Path traversal
Unexpected slashes
Control characters
Malformed Unicode where problematic
Extremely long filenames
Empty filenames
Dangerous path segments
```

Never directly trust:

```text
../../example.pdf
```

or similar client-provided paths.

---

# 20. File Naming Convention

Use predictable names where practical.

Recommended pattern:

```text
category-year-description.extension
```

Examples:

```text
student-population-2026.xlsx

annual-report-2026.pdf

research-accomplishment-2026.pdf

faculty-profile-2026.xlsx
```

Avoid names such as:

```text
Document1.pdf

FinalFinal2.pdf

New File.xlsx

report latest FINAL.pdf
```

Display names may remain more human-friendly than storage filenames.

---

# 21. R2 Repository Structure

Cloudflare R2 uses object key prefixes rather than actual directories.

Treat prefixes as the repository hierarchy.

Example:

```text
statistical-profile/
    student-population/
        2024/
            student-population-2024.xlsx

        2025/
            student-population-2025.xlsx

        2026/
            student-population-2026.xlsx
```

Example:

```text
higher-education/
    accreditation/
        undergraduate/
            2026/
                accreditation-report-2026.pdf
```

---

# 22. Repository Category Strategy

Version 1 categories should preferably be defined through stable application configuration.

Do not build a database-like dynamic category management system unless explicitly required.

The application should support adding categories without requiring a major architectural rewrite.

Repository categories include:

```text
Statistical Profile
Higher Education Performance
Research
Extension
Financial Performance
Planning Documents
Other Resources
```

Additional categories may be introduced as requirements evolve.

---

# 23. Statistical Profile Categories

## Student Population

```text
Overall Student Population
Main Campus vs External Campuses
Student Population by College
Student Population by Academic Program
```

## Student Profile

```text
Enrollment of Disadvantaged Students
Graduates from Disadvantaged Student Groups
Graduation Rate
Enrollment in Priority Programs
```

## Human Resources

```text
Total Personnel
Permanent vs Non-Permanent Personnel
Teaching vs Non-Teaching Personnel
Personnel by Employment Status
Teaching Personnel by Academic Rank
Teaching Personnel by Educational Qualification
```

## Faculty-to-Student Ratio

```text
Permanent Faculty-to-Student Ratio
Permanent + COS Faculty-to-Student Ratio
```

---

# 24. Higher Education Performance Categories

## Certificate of Program Compliance

```text
Undergraduate Programs
Graduate Programs
```

## Accreditation

Undergraduate:

```text
Overall Accreditation Status
Accreditation by Level
```

Graduate:

```text
Overall Accreditation Status
Accreditation by Level
```

## Licensure Examination Performance

```text
Overall Performance
Programs Above National Passing Rate
Performance by Campus
Performance by College
Performance by Academic Program
```

## Graduate Employability

```text
Overall Employability
Employability by Campus
Employability by College
Employability by Program
```

---

# 25. Research and Extension Categories

Potential categories include:

```text
Research Outputs
Research Publications
Research Reports
Extension Programs
Extension Projects
Extension Accomplishment Reports
Internationalization Activities
```

Only implement categories actually needed by the office.

---

# 26. Financial Performance Categories

Potential resources include:

```text
Budget Utilization Rate
Annual Financial Reports
Budget Reports
Financial Performance Documents
Supporting Spreadsheets
```

---

# 27. Other Repository Categories

The design must remain extensible for resources such as:

```text
Planning Documents
Annual Reports
Institutional Reports
Strategic Plans
Accomplishment Reports
Presentations
Memoranda
Supporting Documents
Statistical Reports
Other Resources
```

---

# 28. Resource Model

Maintain one unified resource model whenever practical.

Do not create separate unrelated data structures for PDFs, Excel files, and images if they represent the same repository concept.

A resource may conceptually contain:

```text
key
filename
displayName
category
section
year
fileType
mimeType
fileSize
uploadDate
downloadUrl
previewUrl
```

Only include fields supported by the actual architecture.

Do not manufacture metadata that does not exist.

---

# 29. Resource Metadata Strategy

Because there is no database, metadata should initially come from:

```text
R2 object key
Filename
R2 object properties
R2 object metadata where necessary
Application category configuration
```

Prefer deriving predictable values from object paths rather than creating duplicate metadata stores.

Example:

```text
statistical-profile/student-population/2026/student-population-2026.xlsx
```

can naturally provide:

```text
Section: Statistical Profile

Category: Student Population

Year: 2026

Filename: student-population-2026.xlsx
```

---

# 30. Search Strategy

Version 1 may initially perform client-side search over resources returned by the repository API.

Searchable fields may include:

```text
Filename
Display name
Category
Year
File type
```

Do not implement a separate search database for the expected initial repository size.

If repository scale eventually makes client-side search unsuitable, document the performance problem before redesigning the search system.

---

# 31. Filtering

Potential filters include:

```text
Year
Section
Category
File type
Campus
College
Program
```

Implement only filters supported by actual repository data.

Do not add empty filters merely because they appear in the requirements document as possibilities.

---

# 32. Sorting

Supported sorting may include:

```text
Newest
Oldest
Name A–Z
Name Z–A
File size
File type
```

Sorting logic should be deterministic.

---

# 33. File Preview Rules

## Images

Supported image files may be displayed directly inside the application.

---

## PDFs

Use either:

```text
Browser PDF viewer

or

Embedded browser-compatible PDF preview
```

Do not add a heavy PDF rendering dependency unless necessary.

---

## Excel

Version 1 should provide:

```text
File information
Download button
```

Full browser spreadsheet preview is not required.

Do not implement Excel editing.

---

# 34. Public Website Pages

Expected public pages include:

```text
Home
Repository
Statistical Profile
Higher Education Performance
Research and Extension
Financial Performance
About
Contact
```

---

# 35. Home Page Direction

The home page may contain:

```text
Office introduction
Repository overview
Featured sections
Quick links
Recently available resources when supported
```

Do not fake recent resources using hardcoded placeholder data after repository integration exists.

---

# 36. Administrator Pages

Potential administrator pages:

```text
/admin/login

/admin

/admin/resources

/admin/resources/upload

/admin/categories

/admin/settings
```

Only build pages that have actual Version 1 responsibilities.

Avoid empty placeholder admin pages unless necessary for architectural setup.

---

# 37. Administrator Dashboard

The dashboard may display:

```text
Total files
PDF count
Excel count
Image count
Storage used
Recent uploads
Repository categories
```

These values should come from actual repository information.

Do not ship fake dashboard statistics.

---

# 38. No Hardcoded Production Data

Static configuration is acceptable for:

```text
Category definitions
Navigation structure
Application constants
Supported file types
File size limits
Route definitions
```

Do not hardcode fake production repository records.

Do not ship placeholder institutional statistics as if they were real.

During UI development, temporary fixtures may be used only when clearly isolated and removed before production integration.

---

# 39. API Design Rules

API endpoints should have one clear responsibility.

Prefer predictable resource-oriented naming.

Possible conceptual endpoints:

```text
GET /api/resources

GET /api/resources/:resource

POST /api/resources/upload-authorize

DELETE /api/resources/:resource

PUT /api/resources/:resource

POST /api/resources/:resource/replace
```

The actual Vercel API implementation may differ.

Protected operations must verify authentication.

---

# 40. API Response Rules

Return consistent structured responses.

Successful responses should be predictable.

Example:

```json
{
  "data": {}
}
```

Error responses should also be predictable.

Example:

```json
{
  "error": {
    "code": "UNAUTHORIZED",
    "message": "Authentication is required."
  }
}
```

Do not leak:

```text
Stack traces
Private credentials
Firebase secrets
R2 secrets
Internal infrastructure details
```

to public users.

---

# 41. Error Handling

The application must gracefully handle:

```text
Failed login
Expired authentication
Unauthorized request
Upload failure
Download failure
File not found
R2 unavailable
Network failure
Unsupported file type
Oversized file
Duplicate filename
Malformed resource key
Invalid category
Invalid year
```

Users should receive clear, human-readable messages.

Do not display raw provider errors directly.

---

# 42. Logging

Development logging may help diagnose:

```text
Authentication failures
Upload failures
API failures
R2 errors
Validation errors
Unexpected application errors
```

Never log:

```text
Passwords
Firebase ID tokens
Refresh tokens
R2 secret keys
Authentication headers
Private service credentials
Sensitive institutional information unnecessarily
```

Production logging should be conservative.

---

# 43. Environment Variables

Configuration must use environment variables where appropriate.

Potential client-side variables:

```text
VITE_FIREBASE_API_KEY
VITE_FIREBASE_AUTH_DOMAIN
VITE_FIREBASE_PROJECT_ID
VITE_FIREBASE_APP_ID
```

Only expose values intended for frontend Firebase initialization.

Potential server-side values:

```text
R2_ACCOUNT_ID
R2_ACCESS_KEY_ID
R2_SECRET_ACCESS_KEY
R2_BUCKET_NAME
R2_ENDPOINT
```

Firebase server verification may also require appropriate server-side configuration depending on the final implementation.

Never commit real secrets.

---

# 44. Environment Files

Recommended local structure:

```text
.env
.env.local
.env.example
```

Rules:

```text
.env files containing secrets must be ignored by Git.

.env.example must contain variable names but no real credentials.

Production secrets belong in Vercel environment variables.
```

---

# 45. TypeScript Rules

TypeScript is mandatory.

Avoid unnecessary use of:

```ts
any
```

Prefer:

```text
Explicit domain types
Inferred local types where obvious
Unknown for untrusted input
Type narrowing
Zod validation at boundaries
```

Do not silence TypeScript errors simply to make a build pass.

Avoid:

```ts
// @ts-ignore
```

unless there is a documented and justified reason.

---

# 46. Input Validation

Any data crossing a trust boundary must be validated.

Examples:

```text
Form input
Route parameters
Query parameters
API request bodies
Upload metadata
File metadata
Category identifiers
Year values
Object keys
External API responses where necessary
```

Use Zod where appropriate.

TypeScript types alone do not validate runtime input.

---

# 47. React Rules

Prefer functional React components.

Use hooks correctly.

Keep components small enough to understand.

Avoid:

```text
Huge all-in-one page components
Deep prop drilling when avoidable
Duplicated loading logic
Duplicated API logic
Side effects inside rendering
Direct DOM manipulation when React can handle it
```

Do not overengineer simple UI.

---

# 48. State Management

Use the smallest appropriate state solution.

Use:

```text
Local component state
```

for local UI concerns.

Use:

```text
TanStack Query
```

for asynchronous server state.

Use global client state only when truly shared.

Do not duplicate server state into unnecessary global stores.

---

# 49. TanStack Query Rules

TanStack Query should manage repository/server request state where appropriate.

Use it for:

```text
Fetching repository resources
Caching server responses
Loading state
Error state
Mutation lifecycle
Refetching after changes
```

Do not manually implement an alternative caching framework.

---

# 50. Form Rules

Use React Hook Form for significant forms.

Use Zod for validation.

Examples:

```text
Administrator login
Upload form
Resource rename form
Resource replacement form
Settings where applicable
```

Display validation errors close to the relevant field.

---

# 51. Styling Rules

Use Tailwind CSS as the primary styling system.

Use shadcn/ui for reusable UI primitives where suitable.

Avoid mixing multiple competing styling systems without reason.

Do not introduce:

```text
Bootstrap
Material UI
Ant Design
```

unless the architecture is intentionally changed.

---

# 52. UI Direction

The system should look like an institutional university/government information system.

Design qualities:

```text
Professional
Clean
Formal
Accessible
Simple
Information-focused
Consistent
Responsive
CPSU-oriented
```

Avoid:

```text
Excessive animations
Gaming-style effects
Distracting gradients
Unnecessary glassmorphism
Overly decorative interactions
Visual clutter
```

Function and clarity take priority.

---

# 53. CPSU Branding

Where official assets and branding guidelines are available, follow them.

Do not invent official:

```text
Logos
Seal variants
Colors claimed as official
Office statements
Contact information
Institutional statistics
```

If official information has not been supplied, keep implementation configurable instead of fabricating content.

---

# 54. Responsive Design

Support:

```text
Desktop
Laptop
Tablet
Mobile
```

Primary optimization should favor office desktop/laptop usage.

Mobile layouts must still remain fully usable.

Avoid designs that only work at a single screen width.

---

# 55. Accessibility Rules

Accessibility is mandatory.

Implement:

```text
Semantic HTML
Keyboard navigation
Visible focus states
Accessible labels
Descriptive button text
Alternative text for meaningful images
Readable font sizes
Good contrast
Accessible forms
Proper heading hierarchy
Responsive layouts
```

Do not use a clickable `<div>` when a semantic `<button>` or `<a>` is appropriate.

---

# 56. Loading States

Asynchronous operations must communicate progress.

Examples:

```text
Repository loading
Login processing
Upload processing
Delete processing
Resource refreshing
```

Avoid blank interfaces during async operations.

---

# 57. Empty States

Provide meaningful empty states.

Examples:

```text
No resources available
No search results
No files in this category
No recent uploads
```

Empty states should guide users without implying an error when none occurred.

---

# 58. Destructive Actions

Delete and destructive replacement operations require deliberate confirmation.

Never delete a resource because of a single accidental click.

Confirmation dialogs should clearly identify what will happen.

---

# 59. Duplicate Handling

Duplicate object keys must be handled deliberately.

Do not silently overwrite existing files.

Possible behaviors:

```text
Reject duplicate
Ask administrator to replace
Generate an approved alternate filename
```

The final behavior must be explicit.

---

# 60. Download Behavior

Public files should remain easy to download.

Downloads must preserve useful filenames where possible.

Do not require authentication for resources intended to be public.

Protected/private resources should not be introduced without an explicit access-control requirement.

---

# 61. Security Principles

Always follow:

```text
Least privilege
Server-side authorization
Input validation
Secret isolation
Safe error handling
Safe file naming
Explicit trust boundaries
Minimal data exposure
```

Do not rely on obscurity.

---

# 62. Never Trust the Client

Treat all browser-provided information as untrusted.

Examples:

```text
User role
File type
File size
Filename
Object key
Category
Year
Authorization status
Requested action
```

Validate important values again server-side.

---

# 63. Authentication Token Handling

Send Firebase ID tokens only where authentication is required.

Use standard authorization headers where appropriate.

Do not store authentication tokens in arbitrary application files.

Do not log them.

Do not expose them through URLs.

---

# 64. Secret Handling

Never place secrets in:

```text
Source files
Public configuration files
Git commits
README examples with real values
Client bundles
Screenshots
Logs
Error messages
```

If a secret is accidentally committed, treat it as compromised and rotate it.

---

# 65. Git Rules

GitHub stores:

```text
Source code
Project history
Issues
Collaboration information
Documentation
```

GitHub does NOT serve as the production institutional document repository.

Uploaded institutional resources belong in Cloudflare R2.

---

# 66. Git Commit Guidelines

Prefer small, meaningful commits.

Examples:

```text
chore: initialize vite project

chore: configure eslint and prettier

feat: add public application router

feat: add firebase authentication

feat: add repository resource listing

fix: validate uploaded file mime type

docs: add deployment guide
```

Avoid vague messages such as:

```text
update
changes
fix stuff
final
final2
```

---

# 67. Do Not Commit Generated or Secret Files

Keep appropriate files ignored.

Examples may include:

```text
node_modules/
dist/
.env
.env.local
coverage/
temporary files
editor-specific temporary files
```

Review `.gitignore` whenever new tooling is introduced.

---

# 68. Testing Gate

Before declaring a development brick complete, run the relevant project checks.

At minimum:

```bash
npm run typecheck
npm run lint
npm run build
```

If tests exist:

```bash
npm test
```

or the project's defined equivalent.

Do not say a brick is complete when known errors remain.

---

# 69. Manual Validation

Automated checks do not replace manual verification.

Where applicable, manually test:

```text
Route rendering
Responsive layout
Navigation
Authentication
Protected routes
Upload
Download
Delete
Search
Filters
Preview
Error states
Empty states
```

---

# 70. Development Phase Order

Follow the project phases unless there is a clear reason to adjust them.

## Phase 0 — Project Planning

```text
Requirements
Repository categories
User roles
File formats
Technology stack
Architecture
```

---

## Phase 1 — Project Foundation

```text
Vite React TypeScript
Git
ESLint
Prettier
Tailwind CSS
shadcn/ui
TypeScript aliases
Environment configuration
Core dependencies
```

---

## Phase 2 — Application Architecture

```text
Folder architecture
Application router
Public layout
Administrator layout
Shared components
Service layer
Type definitions
```

---

## Phase 3 — Public Website Foundation

```text
Home
Navigation
Footer
Repository page
About
Responsive layout
```

---

## Phase 4 — Firebase Authentication

```text
Firebase project configuration
Firebase Auth integration
Login
Logout
Auth state
Protected routes
Session handling
```

---

## Phase 5 — Cloudflare R2 Foundation

```text
R2 bucket
Credentials
R2 service
Secure API
Object listing
Object retrieval
```

---

## Phase 6 — Repository Reading

```text
List resources
Map R2 objects to resource model
Resource cards/table
Resource details
File icons
File size formatting
Downloads
```

---

## Phase 7 — Search and Filtering

```text
Search
Category filter
Year filter
File type filter
Sorting
Empty states
```

---

## Phase 8 — Administrator File Management

```text
Upload form
File validation
Secure upload
Upload progress
Delete
Replace
Duplicate handling
Confirmation dialogs
```

---

## Phase 9 — Repository Organization

```text
Statistical Profile
Higher Education Performance
Research
Extension
Financial Performance
Other Resources
```

---

## Phase 10 — File Preview

```text
Images
PDF
Excel download interface
Resource information
```

---

## Phase 11 — Dashboard

```text
File totals
Type statistics
Storage information
Recent uploads
Categories
```

---

## Phase 12 — Security Hardening

```text
Firebase token verification
Admin API protection
R2 credential isolation
Server-side validation
MIME validation
Filename sanitization
Rate limiting where appropriate
Security headers
```

---

## Phase 13 — UX and Accessibility

```text
Loading states
Empty states
Error states
Mobile layouts
Keyboard navigation
Accessibility
Form feedback
```

---

## Phase 14 — Testing

Test:

```text
Authentication
Authorization
Uploads
Downloads
Deletes
Search
Filters
Routing
File validation
Responsive behavior
Error handling
```

---

## Phase 15 — Production Deployment

```text
GitHub
Vercel
Production Firebase
Production R2
Environment variables
Domain
Production testing
```

---

## Phase 16 — Documentation

Produce:

```text
README
Administrator Manual
Deployment Manual
Architecture Documentation
Environment Configuration Guide
Backup Guide
Maintenance Guide
Account Ownership Guide
```

---

## Phase 17 — Final Handover

Verify:

```text
Administrator access
Cloudflare access
Firebase access
Vercel access
GitHub access
Domain ownership
Backup
Documentation
Staff training
```

---

# 71. Brick-by-Brick Agent Behavior

When implementing a brick:

1. Inspect the current repository first.
2. Understand the existing architecture.
3. Identify the smallest required change.
4. Avoid unrelated refactoring.
5. Implement only that brick.
6. Run validation.
7. Fix errors introduced by the brick.
8. Summarize what changed.
9. State which files were created or modified.
10. State validation results.
11. Stop before implementing the next major brick unless explicitly instructed to continue.

---

# 72. Do Not Skip Ahead

If the project is currently configuring foundation tooling, do not suddenly implement:

```text
R2 uploads
Admin dashboard
Search
Firebase authentication
Production deployment
```

unless explicitly instructed.

Preserve dependency order.

---

# 73. Existing Code Takes Priority

Before creating a new file or abstraction:

```text
Search for an existing implementation.
Inspect nearby code.
Reuse existing patterns.
Avoid duplicate utilities.
Avoid duplicate types.
Avoid duplicate components.
```

Do not create `utils2.ts`, `helpers-new.ts`, or similar parallel systems simply because existing code was overlooked.

---

# 74. Refactoring Rule

Refactor only when:

```text
Required for the current brick
Fixing a demonstrated problem
Removing meaningful duplication
Improving safety or maintainability
```

Avoid large aesthetic refactors during unrelated tasks.

---

# 75. Backward Compatibility

Do not break existing working behavior to introduce a new feature.

When changing shared utilities, routes, types, or services, inspect all callers.

---

# 76. Error Fixing Rule

When an error occurs:

1. Read the full error.
2. Determine the root cause.
3. Inspect the relevant configuration or dependency version.
4. Apply the smallest correct fix.
5. Re-run validation.
6. Avoid hiding the error.

Do not suppress TypeScript, ESLint, or runtime errors without understanding them.

---

# 77. Dependency Version Awareness

Libraries and frameworks may evolve.

Do not assume commands or configuration from outdated versions are correct.

When configuring:

```text
Vite
React
Tailwind
shadcn/ui
Firebase
Cloudflare SDKs
Vercel
TypeScript
ESLint
```

use the APIs and configuration appropriate to the version actually installed in the project.

---

# 78. Production Data Rule

Never delete, modify, or overwrite production repository data during development or testing unless explicitly authorized.

Use safe test resources when testing administrative functions.

---

# 79. Backup Principle

Cloudflare R2 is the live repository, but it must not become the only copy of critical institutional records.

Recommended long-term model:

```text
Primary
└── Cloudflare R2

Backup
├── Office-controlled external storage
or
└── Official institutional cloud storage
```

Do not claim the application itself is a complete archival or backup solution.

---

# 80. Institutional Ownership

Production services should eventually belong to CPSU or the Planning and Development Office rather than an individual developer.

This includes:

```text
GitHub
Vercel
Firebase
Cloudflare
Domain
Backup storage
```

Development decisions should support future ownership transfer.

---

# 81. Long-Term Maintainability

Prefer code that another developer can understand years later.

Optimize for:

```text
Clarity
Predictability
Simple architecture
Documentation
Low operational complexity
Standard technologies
Minimal vendor lock-in
```

Avoid clever but obscure implementations.

---

# 82. Vendor Lock-In Principle

Institutional files should remain standard downloadable files.

The repository should be migratable.

Avoid transforming files into proprietary formats unnecessarily.

Cloudflare R2 storage should remain replaceable with another object-storage provider if required in the future.

---

# 83. Documentation Rule

Whenever architecture, deployment, environment configuration, or operational procedures materially change, update the corresponding documentation.

Important documents include:

```text
README.md
AGENTS.md
Architecture documentation
Deployment guide
Environment variable guide
Administrator guide
Backup guide
Recovery guide
Maintenance guide
```

Code and documentation should not intentionally contradict each other.

---

# 84. README Responsibilities

The final README should eventually explain:

```text
Project purpose
Technology stack
Prerequisites
Installation
Development setup
Environment variables
Available commands
Architecture overview
Testing
Deployment
Documentation references
```

Never include production credentials.

---

# 85. Administrator Documentation

The administrator manual should eventually explain:

```text
Login
Logout
Repository navigation
Uploading
File requirements
Replacing files
Renaming
Deleting
Previewing
Downloading
Troubleshooting
Backup responsibilities
```

Use office-friendly language rather than developer jargon.

---

# 86. Deployment Documentation

The deployment guide should explain:

```text
GitHub repository
Vercel project
Environment variables
Firebase setup
Cloudflare R2 setup
Domain configuration
Production validation
Account ownership
Recovery
```

---

# 87. Production Deployment Flow

Expected source deployment:

```text
Developer
    │
    ▼
Git Commit
    │
    ▼
GitHub
    │
    ▼
Vercel
    │
    ▼
Production Website
```

Repository documents remain in R2.

They must not be bundled inside normal frontend deployments.

---

# 88. File Repository Independence

Application deployments and repository files must remain separate.

Redeploying the React application should not:

```text
Delete repository files
Re-upload repository files
Reset repository data
Require files to be committed to Git
```

This is a critical architectural requirement.

---

# 89. Performance Guidelines

Prefer efficient repository interactions.

Avoid:

```text
Repeatedly fetching the same object list unnecessarily
Downloading entire files just to show metadata
Rendering very large resource lists without consideration
Blocking the UI during network operations
Large unnecessary frontend dependencies
```

Use TanStack Query caching where appropriate.

Optimize only after identifying meaningful performance issues.

---

# 90. Pagination and Scale

Client-side search and filtering are acceptable for the expected initial repository size.

If object counts become large enough to affect performance, consider:

```text
Server-side pagination
Prefix-based listing
Incremental loading
Search indexing
```

Do not introduce these prematurely.

---

# 91. File URLs

Avoid assuming every R2 object must permanently expose a public raw URL.

URL strategy should reflect the final bucket and security configuration.

Public resources may use suitable public access or server-generated access methods.

Protected administrative operations must remain authenticated.

---

# 92. Data Integrity

Operations that modify resources should avoid leaving partial or inconsistent states.

Examples:

```text
Replace should not unintentionally destroy the previous file before the replacement succeeds.

Rename should avoid accidentally duplicating or losing the object.

Delete should clearly confirm the exact object.
```

Treat file operations as institutional data operations, not casual UI actions.

---

# 93. Resource Replacement

Cloud object storage does not behave exactly like a traditional local filesystem.

When implementing replace or rename functionality, understand the storage API behavior.

Do not assume a native atomic rename exists.

Implement storage operations deliberately and safely.

---

# 94. Security Headers

During production hardening, consider appropriate headers such as:

```text
Content-Security-Policy
X-Content-Type-Options
Referrer-Policy
Permissions-Policy
Frame-related protections where appropriate
```

Do not apply security headers blindly if they break required PDF/image behavior.

Test them.

---

# 95. Rate Limiting

Rate limiting may be introduced where appropriate for sensitive or expensive API operations.

Prioritize:

```text
Authentication-sensitive endpoints
Upload authorization
Delete operations
Other privileged actions
```

Do not implement a complex rate-limiting infrastructure prematurely.

---

# 96. Error Boundaries

Use React error handling where useful for application-level failures.

Unexpected UI errors should not expose a broken blank page without guidance when recoverable.

---

# 97. User Feedback

Use clear UI feedback for operations.

Examples:

```text
Upload succeeded
Upload failed
Resource deleted
Invalid file type
File too large
Authentication expired
No resources found
Network unavailable
```

Avoid vague messages such as:

```text
Something happened.
Error 500.
Failed.
```

when a safer, useful explanation is available.

---

# 98. Accessibility Over Decoration

If a visual effect conflicts with:

```text
Readability
Keyboard access
Contrast
Performance
Clarity
```

choose accessibility and clarity.

---

# 99. No Fabricated Institutional Information

Never invent:

```text
Student statistics
Financial figures
Graduation rates
Accreditation results
Licensure performance
Personnel counts
Research outputs
Official contact information
Office announcements
Official documents
```

Use real supplied repository content only.

If data is unavailable, display an appropriate empty state.

---

# 100. Agent Output Expectations

After making code changes, provide a concise implementation report containing:

```text
Brick completed
Files created
Files modified
Main implementation decisions
Commands executed
Typecheck result
Lint result
Build/test result
Known limitations
Recommended next brick
```

Do not claim commands passed if they were not actually executed.

---

# 101. Decision Priority

When instructions conflict, use this priority:

```text
1. Security
2. Explicit current project requirements
3. This AGENTS.md architecture contract
4. Existing established repository conventions
5. Maintainability
6. Simplicity
7. Personal coding preference
```

---

# 102. Architecture Change Procedure

Do not make major architectural changes silently.

Major changes include:

```text
Adding a database
Replacing Firebase Authentication
Replacing Cloudflare R2
Changing frontend framework
Replacing Vercel hosting
Introducing a backend server that changes deployment architecture
Changing public/private repository assumptions
Introducing complex new state management
```

If a major change appears necessary:

1. Explain the limitation in the current architecture.
2. Explain why the new requirement cannot reasonably fit.
3. Propose the smallest architectural change.
4. Describe migration consequences.
5. Wait for an explicit project decision before implementation where practical.

---

# 103. Preferred Engineering Philosophy

Use:

```text
Simple before clever
Explicit before magical
Secure by default
Reusable without over-abstraction
Architecture before features
Small bricks before large rewrites
Working software before speculative optimization
Institutional maintainability before developer convenience
```

---

# 104. Core Rules Summary

Never forget the following:

```text
Firebase authenticates administrators.

Vercel securely handles privileged server operations.

Cloudflare R2 stores repository files.

React provides the public and administrator interfaces.

R2 secrets never enter frontend code.

Protected APIs verify Firebase authentication server-side.

The application uses no traditional database in Version 1.

Repository files remain separate from application deployments.

Only supported file types may be uploaded.

File operations must be validated and secure.

Do not fabricate institutional data.

Do not build unnecessary Version 2 features during Version 1.

Follow architecture-first, brick-by-brick development.

Every brick must work and pass project checks before moving forward.
```

---

# 105. Final Baseline Architecture

```text
                       CPSU PDO
                    Information Hub
                          │
                          ▼
                    React + Vite
                          │
                       Vercel
                ┌─────────┴─────────┐
                │                   │
                ▼                   ▼
          Public Website        Secure APIs
                                    │
                         ┌──────────┴──────────┐
                         │                     │
                         ▼                     ▼
                  Firebase Auth          Cloudflare R2
                       │                     │
                 Admin Login           Repository
                                             │
                                    ┌────────┼────────┐
                                    │        │        │
                                   PDF     XLSX     Images
```

## Final Architecture Rule

**Firebase Authentication authenticates administrators.**

**Vercel APIs protect privileged operations and communicate securely with infrastructure services.**

**Cloudflare R2 stores institutional repository files.**

**React + Vite provides the user-facing application.**

**Firestore and traditional databases are not part of Version 1.**

This architecture remains the project's baseline unless a future requirement genuinely requires and explicitly approves a change.

## graphify

This project has a knowledge graph at graphify-out/ with god nodes, community structure, and cross-file relationships.

When the user types `/graphify`, use the installed graphify skill or instructions before doing anything else.

Rules:
- For codebase questions, first run `graphify query "<question>"` when graphify-out/graph.json exists. Use `graphify path "<A>" "<B>"` for relationships and `graphify explain "<concept>"` for focused concepts. These return a scoped subgraph, usually much smaller than GRAPH_REPORT.md or raw grep output.
- Dirty graphify-out/ files are expected after hooks or incremental updates; dirty graph files are not a reason to skip graphify. Only skip graphify if the task is about stale or incorrect graph output, or the user explicitly says not to use it.
- If graphify-out/wiki/index.md exists, use it for broad navigation instead of raw source browsing.
- Read graphify-out/GRAPH_REPORT.md only for broad architecture review or when query/path/explain do not surface enough context.
- After modifying code, run `graphify update .` to keep the graph current (AST-only, no API cost).
