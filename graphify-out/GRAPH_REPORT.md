# Graph Report - .  (2026-08-12)

## Corpus Check
- 57 files · ~55,840 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 324 nodes · 419 edges · 24 communities (23 shown, 1 thin omitted)
- Extraction: 95% EXTRACTED · 5% INFERRED · 0% AMBIGUOUS · INFERRED: 21 edges (avg confidence: 0.91)
- Token cost: 19,480 input · 8,860 output

## Community Hubs (Navigation)
- Repository Key Parsing
- R2 Listing Configuration
- Lint and Test Tooling
- React Resource Contracts
- Runtime Dependencies
- Server TypeScript Configuration
- Client TypeScript Configuration
- Graphify Knowledge System
- Repository Architecture Contract
- Resource API Boundary
- Package Scripts
- Original CPSU Seal
- Public Layout Navigation
- Social Icon Sprite
- Transparent CPSU Seal
- Legacy Vite Favicon
- Vite Logo Asset
- Hero Layer Illustration
- React Logo Asset
- R2 Metadata Convention
- Repository Design Taxonomy
- Institutional Design Direction
- TypeScript Project References

## God Nodes (most connected - your core abstractions)
1. `compilerOptions` - 18 edges
2. `compilerOptions` - 16 edges
3. `listResources()` - 14 edges
4. `Graphify` - 10 edges
5. `Central Philippines State University seal` - 10 edges
6. `scripts` - 7 edges
7. `handleResourcesRequest()` - 7 edges
8. `Central Philippines State University Seal` - 7 edges
9. `parseResourceObjectKey()` - 6 edges
10. `include` - 6 edges

## Surprising Connections (you probably didn't know these)
- `R2 Object Key Convention` --semantically_similar_to--> `Metadata Derived from R2 Object Keys`  [INFERRED] [semantically similar]
  README.md → AGENTS.md
- `fetch()` --calls--> `handleResourcesRequest()`  [EXTRACTED]
  api/resources.ts → server/http/resourcesHandler.ts
- `Content Is the Design` --conceptually_related_to--> `PDO Repository Taxonomy`  [INFERRED]
  DESIGN_AESTHETICS.md → AGENTS.md
- `Server-Only R2 Configuration` --conceptually_related_to--> `Least Privilege and Server-Side Authorization`  [INFERRED]
  README.md → AGENTS.md
- `CPSU Information Hub HTML Application Shell` --references--> `CPSU PDO Information Hub Overview`  [INFERRED]
  index.html → README.md

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **Graphify Extraction Pipeline** — _codex_skills_graphify_skill_persistent_knowledge_graph, _codex_skills_graphify_skill_structural_and_semantic_extraction, _codex_skills_graphify_references_extraction_spec_confidence_rubric [EXTRACTED 1.00]
- **CPSU Repository Architecture** — agents_firebase_authentication, agents_cloudflare_r2_repository, agents_vercel_server_apis, agents_react_application [EXTRACTED 1.00]
- **CPSU Institutional Design Signature** — design_aesthetics_institutional_archive, design_aesthetics_cpsu_visual_identity, design_aesthetics_archive_motifs [EXTRACTED 1.00]
- **Favicon emblem composition** — public_favicon_favicon, public_favicon_lightning_bolt, public_favicon_purple_palette, public_favicon_blue_highlights, public_favicon_blurred_glow, public_favicon_alpha_mask [EXTRACTED 1.00]
- **Social platform icon set** — public_icons_bluesky_icon, public_icons_discord_icon, public_icons_github_icon, public_icons_x_icon [INFERRED 0.95]
- **CPSU Seal Composition** — src_assets_cpsu_logo_transparent_torch_book_and_carabao, src_assets_cpsu_logo_transparent_philippines_map, src_assets_cpsu_logo_transparent_sunrise_and_mountains, src_assets_cpsu_logo_transparent_green_yellow_palette [EXTRACTED 1.00]
- **CPSU seal visual composition** — src_assets_cpsu_logo_cpsu_seal, src_assets_cpsu_logo_philippines_map, src_assets_cpsu_logo_carabao_head, src_assets_cpsu_logo_torch, src_assets_cpsu_logo_open_book, src_assets_cpsu_logo_sun_rays, src_assets_cpsu_logo_mountain_landscape, src_assets_cpsu_logo_green_yellow_palette [EXTRACTED 1.00]
- **CPSU institutional identity** — src_assets_cpsu_logo_cpsu_seal, src_assets_cpsu_logo_central_philippines_state_university, src_assets_cpsu_logo_negros_occidental, src_assets_cpsu_logo_year_1946 [EXTRACTED 1.00]
- **Layered Platform Composition** — src_assets_hero_upper_rounded_layer, src_assets_hero_lower_purple_layer, src_assets_hero_vertical_connectors [EXTRACTED 1.00]
- **React Logo Composition** — src_assets_react_atomic_orbit_motif, src_assets_react_central_nucleus, src_assets_react_cyan_brand_color [EXTRACTED 1.00]
- **Vite logo visual composition** — src_assets_vite_logo, src_assets_vite_lightning_bolt_emblem, src_assets_vite_parenthesis_pair, src_assets_vite_purple_blue_glow, src_assets_vite_lightning_alpha_mask [EXTRACTED 1.00]

## Communities (24 total, 1 thin omitted)

### Community 0 - "Repository Key Parsing"
Cohesion: 0.09
Nodes (28): createFallbackDisplayName(), invalidKey(), InvalidResourceObjectKeyError, ParsedResourceObjectKey, parseResourceObjectKey(), RepositoryCategory, repositoryCategoryById, repositoryCategoryIds (+20 more)

### Community 1 - "R2 Listing Configuration"
Cohesion: 0.11
Nodes (25): getR2Config(), optionalServerUrlSchema, R2Config, R2ConfigurationError, r2EnvironmentSchema, serverUrlSchema, validEnvironment, compareByKey() (+17 more)

### Community 2 - "Lint and Test Tooling"
Cohesion: 0.07
Nodes (29): eslint, @eslint/js, eslint-plugin-react-hooks, eslint-plugin-react-refresh, globals, devDependencies, eslint, @eslint/js (+21 more)

### Community 3 - "React Resource Contracts"
Cohesion: 0.10
Nodes (17): App(), AppProviders(), ArchiveFolderIllustration(), repositorySections, apiErrorResponseSchema, ResourceListResponse, resourceListResponseSchema, ResourceQuery (+9 more)

### Community 4 - "Runtime Dependencies"
Cohesion: 0.08
Nodes (25): @aws-sdk/client-s3, class-variance-authority, clsx, lucide-react, dependencies, @aws-sdk/client-s3, class-variance-authority, clsx (+17 more)

### Community 5 - "Server TypeScript Configuration"
Cohesion: 0.08
Nodes (24): api/**/*.ts, node, server/**/*.ts, src/config/repository.ts, src/contracts/**/*.ts, vite.config.ts, compilerOptions, allowImportingTsExtensions (+16 more)

### Community 6 - "Client TypeScript Configuration"
Cohesion: 0.08
Nodes (23): DOM, src, vite/client, compilerOptions, allowArbitraryExtensions, allowImportingTsExtensions, erasableSyntaxOnly, jsx (+15 more)

### Community 7 - "Graphify Knowledge System"
Cohesion: 0.14
Nodes (14): URL Ingestion and Folder Watch, Graph Export Formats and MCP Server, Extracted Inferred Ambiguous Confidence Rubric, Semantic Extraction Contract, GitHub Clone and Cross-Repository Merge, Post-Commit Hook and CLAUDE.md Integration, Constrained Query Expansion, Graph Query Path and Explain Traversal (+6 more)

### Community 8 - "Repository Architecture Contract"
Cohesion: 0.19
Nodes (13): Architecture-First Brick-by-Brick Development, Cloudflare R2 File Repository, CPSU PDO Information Hub Architecture Contract, Firebase Administrator Authentication, Protected Administrator Authorization Flow, React Application, Least Privilege and Server-Side Authorization, Vercel Server APIs (+5 more)

### Community 9 - "Resource API Boundary"
Cohesion: 0.23
Nodes (8): fetch(), resourcesApiPlugin(), handleResourcesRequest(), jsonHeaders, jsonResponse(), emptyRepository, testR2Config, ListResourcesDependencies

### Community 10 - "Package Scripts"
Cohesion: 0.17
Nodes (11): name, private, scripts, build, dev, lint, preview, test (+3 more)

### Community 11 - "Original CPSU Seal"
Cohesion: 0.22
Nodes (11): Carabao head and horns, Central Philippines State University, Central Philippines State University seal, Green and yellow institutional palette, Mountain landscape, Negros Occidental, Open book, Map of the Philippines (+3 more)

### Community 12 - "Public Layout Navigation"
Cohesion: 0.27
Nodes (5): PublicFooter(), PublicHeader(), NavigationItem, publicNavigation, PublicLayout()

### Community 13 - "Social Icon Sprite"
Cohesion: 0.39
Nodes (8): Bluesky icon, Discord icon, Documentation and code icon, GitHub icon, Social profile icon, Social platform links, SVG icon symbol sprite, X social network icon

### Community 14 - "Transparent CPSU Seal"
Cohesion: 0.25
Nodes (8): Foundation Year 1946, Green and Yellow Institutional Palette, Negros Occidental, Central Philippines State University Seal, Map of the Philippines, Sun Rays and Mountain Landscape, Torch, Open Book, and Carabao Emblem, Central Philippines State University

### Community 15 - "Legacy Vite Favicon"
Cohesion: 0.33
Nodes (7): Lightning-shaped alpha mask, Blue highlight accents, Blurred multicolor glow, Application favicon, Stylized lightning-bolt emblem, Purple color palette, Vite visual identity

### Community 16 - "Vite Logo Asset"
Cohesion: 0.33
Nodes (7): Color-scheme-adaptive parenthesis contrast, Lightning-shaped alpha mask, Stylized lightning-bolt emblem, Vite logo, Pair of enclosing parentheses, Purple and blue blurred glow, Vite

### Community 17 - "Hero Layer Illustration"
Cohesion: 0.90
Nodes (5): Layered Information Architecture, Layered Platform Hero Illustration, Lower Purple Rounded Layer, Upper Outlined Rounded Layer, Vertical Dotted Layer Connectors

### Community 18 - "React Logo Asset"
Cohesion: 0.67
Nodes (4): Atomic Orbit Motif, Central Circular Nucleus, React Cyan Brand Color, React Logo

### Community 19 - "R2 Metadata Convention"
Cohesion: 0.67
Nodes (3): No Traditional Database, Metadata Derived from R2 Object Keys, R2 Object Key Convention

### Community 20 - "Repository Design Taxonomy"
Cohesion: 0.67
Nodes (3): PDO Repository Taxonomy, Archive Tabs Report Rules and Green Reference Line, Content Is the Design

### Community 21 - "Institutional Design Direction"
Cohesion: 0.67
Nodes (3): Accessible Long-Term Institutional Interface, CPSU Institutional Visual Identity, The Institutional Archive

## Knowledge Gaps
- **135 isolated node(s):** `name`, `private`, `version`, `type`, `dev` (+130 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **1 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `devDependencies` connect `Lint and Test Tooling` to `Package Scripts`?**
  _High betweenness centrality (0.027) - this node is a cross-community bridge._
- **Why does `dependencies` connect `Runtime Dependencies` to `Package Scripts`?**
  _High betweenness centrality (0.024) - this node is a cross-community bridge._
- **What connects `name`, `private`, `version` to the rest of the system?**
  _135 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Repository Key Parsing` be split into smaller, more focused modules?**
  _Cohesion score 0.0907563025210084 - nodes in this community are weakly interconnected._
- **Should `R2 Listing Configuration` be split into smaller, more focused modules?**
  _Cohesion score 0.11491935483870967 - nodes in this community are weakly interconnected._
- **Should `Lint and Test Tooling` be split into smaller, more focused modules?**
  _Cohesion score 0.06896551724137931 - nodes in this community are weakly interconnected._
- **Should `React Resource Contracts` be split into smaller, more focused modules?**
  _Cohesion score 0.10098522167487685 - nodes in this community are weakly interconnected._