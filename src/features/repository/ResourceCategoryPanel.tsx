import {
  Download,
  Eye,
  File,
  FileImage,
  FileText,
} from "lucide-react";
import { useState } from "react";
import type { Resource } from "../../contracts/resource";
import { ResourcePreview } from "./ResourcePreview";
import type { ResourceCategoryGroup } from "./groupResourcesByCategory";

type ResourceCategoryPanelProps = {
  group: ResourceCategoryGroup;
};

const fileTypeDetails = {
  pdf: { icon: FileText, label: "PDF" },
  xlsx: { icon: File, label: "File" },
  image: { icon: FileImage, label: "IMG" },
} as const;

function formatFileSize(bytes: number) {
  if (bytes < 1_024) return `${bytes} B`;
  if (bytes < 1_048_576) return `${(bytes / 1_024).toFixed(1)} KB`;
  return `${(bytes / 1_048_576).toFixed(1)} MB`;
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-PH", {
    dateStyle: "medium",
    timeZone: "Asia/Manila",
  }).format(new Date(value));
}

function ResourceRow({ resource }: { resource: Resource }) {
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const details = fileTypeDetails[resource.fileType];
  const FileIcon = details.icon;
  const canPreview = resource.fileType !== "xlsx" && Boolean(resource.previewUrl);

  return (
    <li className="py-4 sm:py-5">
      <div className="flex gap-3 sm:gap-4">
        <div className="flex size-10 shrink-0 items-center justify-center rounded-xl border border-border bg-primary-soft text-primary">
          <FileIcon className="size-5" strokeWidth={1.6} aria-hidden="true" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-xs font-semibold text-muted-foreground">
            File name
          </p>
          <p className="mt-1 break-words text-sm font-semibold leading-6 text-foreground [overflow-wrap:anywhere]">
            {resource.filename}
          </p>
          <dl className="mt-3 flex flex-wrap gap-x-4 gap-y-2 text-xs text-muted-foreground">
            <div className="flex gap-1">
              <dt className="sr-only">Year</dt>
              <dd>{resource.year}</dd>
            </div>
            <div className="flex gap-1">
              <dt className="sr-only">File type</dt>
              <dd>{details.label}</dd>
            </div>
            <div className="flex gap-1">
              <dt className="sr-only">File size</dt>
              <dd>{formatFileSize(resource.fileSize)}</dd>
            </div>
            <div className="flex gap-1">
              <dt className="sr-only">Uploaded</dt>
              <dd>Uploaded {formatDate(resource.uploadedAt)}</dd>
            </div>
          </dl>
          <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2">
            {canPreview ? (
              <button
                type="button"
                onClick={() => setIsPreviewOpen((current) => !current)}
                aria-expanded={isPreviewOpen}
                className="inline-flex min-h-10 cursor-pointer items-center gap-2 text-sm font-semibold text-primary underline decoration-primary/35 underline-offset-4 hover:decoration-primary focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary"
              >
                <Eye className="size-4" aria-hidden="true" />
                {isPreviewOpen ? "Hide preview" : "Preview"}
              </button>
            ) : null}
            <a
              href={resource.downloadUrl}
              download={resource.filename}
              className="inline-flex min-h-10 items-center gap-2 text-sm font-semibold text-primary underline decoration-primary/35 underline-offset-4 hover:decoration-primary focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary"
            >
              <Download className="size-4" aria-hidden="true" />
              Download
            </a>
          </div>
        </div>
      </div>
      {isPreviewOpen && canPreview ? (
        <ResourcePreview
          resource={resource}
          onClose={() => setIsPreviewOpen(false)}
        />
      ) : null}
    </li>
  );
}

export function ResourceCategoryPanel({ group }: ResourceCategoryPanelProps) {
  return (
    <article
      className="min-w-0"
      aria-label={group.isSectionRoot ? `${group.sectionTitle} files` : undefined}
    >
      {!group.isSectionRoot ? (
        <div className="mb-3 flex flex-wrap items-end justify-between gap-2 border-b border-strong-border pb-2">
          <h4 className="font-serif text-xl tracking-tight text-foreground">
            {group.categoryTitle}
          </h4>
          <p className="text-sm text-muted-foreground">
            {group.resources.length}{" "}
            {group.resources.length === 1 ? "file" : "files"}
          </p>
        </div>
      ) : null}
      <div className="overflow-hidden rounded-2xl border border-border border-t-4 border-t-primary bg-surface shadow-[0_10px_28px_rgba(20,83,45,0.06)]">
        <ul className="divide-y divide-strong-border px-4 sm:px-6">
          {group.resources.map((resource) => (
            <ResourceRow key={resource.key} resource={resource} />
          ))}
        </ul>
      </div>
    </article>
  );
}
