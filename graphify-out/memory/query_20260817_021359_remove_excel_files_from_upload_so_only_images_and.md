---
type: "query"
date: "2026-08-17T02:13:59.335128+00:00"
question: "Remove Excel files from upload so only images and PDF files can be uploaded."
contributor: "graphify"
outcome: "useful"
source_nodes: ["Resource", "resource.ts", "src/contracts/**/*.ts"]
---

# Q: Remove Excel files from upload so only images and PDF files can be uploaded.

## Answer

Expanded from graph vocabulary: resource, resources, file, files, type, contracts. The general resource model still supports existing XLSX records for browsing, but the upload-specific contract now allows only PDF, JPEG, PNG, and WebP MIME types and extensions. ResourceUploadForm, upload authorization, completion validation, and final R2 verification all reject Excel. Tests cover allowed types and XLSX rejection at contract, handler, authorization, and verification boundaries.

## Outcome

- Signal: useful

## Source Nodes

- Resource
- resource.ts
- src/contracts/**/*.ts