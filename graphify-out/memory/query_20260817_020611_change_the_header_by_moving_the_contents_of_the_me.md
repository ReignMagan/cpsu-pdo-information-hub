---
type: "query"
date: "2026-08-17T02:06:11.241536+00:00"
question: "Change the header by moving the contents of the menu dropdown to the header, with no hamburger menu unless it is mobile view."
contributor: "graphify"
outcome: "useful"
source_nodes: ["PublicHeader()", "PublicHeader.tsx", "publicNavigation", "navigation.ts", "PublicLayout()"]
---

# Q: Change the header by moving the contents of the menu dropdown to the header, with no hamburger menu unless it is mobile view.

## Answer

Expanded from graph vocabulary: header, navigation, public, layout, app, application, router. PublicHeader is the shared navigation owner and imports publicNavigation. It now renders inline Home, Repository, About, Contact, and Administrator links at md and above, while keeping a separate mobile-only hamburger and dropdown below md. Tablet branding uses a compact CPSU label to avoid clipping; routes remain sourced from navigation.ts.

## Outcome

- Signal: useful

## Source Nodes

- PublicHeader()
- PublicHeader.tsx
- publicNavigation
- navigation.ts
- PublicLayout()