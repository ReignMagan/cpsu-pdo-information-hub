---
type: "query"
date: "2026-08-17T03:21:39.630455+00:00"
question: "look at the choose file button it's not consistent to others"
contributor: "graphify"
outcome: "useful"
source_nodes: ["Resource", "resourceFilenameSchema", "Accessible Long-Term Institutional Interface", "react"]
---

# Q: look at the choose file button it's not consistent to others

## Answer

Expanded from original query via graph vocabulary: [file, filename, resource, react, accessible, rounded]. The inconsistency came from the browser-native file button in ResourceUploadForm. Replaced only its visible presentation with an accessible rounded label button and live selected-filename text while retaining the real file input, React Hook Form Controller, file-type restrictions, validation, and upload behavior. TypeScript, lint, 113 tests, build, and git diff checks passed.

## Outcome

- Signal: useful

## Source Nodes

- Resource
- resourceFilenameSchema
- Accessible Long-Term Institutional Interface
- react