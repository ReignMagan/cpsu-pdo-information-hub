---
type: "query"
date: "2026-08-17T02:52:30.441887+00:00"
question: "I am lost in the 2 buckets please give me full guide in those 2 buckets which is cpsu-pdo-information-hub and cpsu-pdo-audit"
contributor: "graphify"
outcome: "useful"
source_nodes: ["Cloudflare R2 File Repository", "Protected Administrator Authorization Flow", "R2Config"]
---

# Q: I am lost in the 2 buckets please give me full guide in those 2 buckets which is cpsu-pdo-information-hub and cpsu-pdo-audit

## Answer

Expanded via graph vocab: [cloudflare, repository, resource, administrator, security, files]. cpsu-pdo-information-hub stores public PDF/image resources, needs an r2.dev development URL, R2_PUBLIC_BASE_URL, and CORS for local browser PUT requests. cpsu-pdo-audit stores private JSON administrator audit events under _system/audit, must have public access disabled and needs no CORS. One Object Read & Write S3 token must be scoped to both named buckets because the code uses one credential pair for both.

## Outcome

- Signal: useful

## Source Nodes

- Cloudflare R2 File Repository
- Protected Administrator Authorization Flow
- R2Config