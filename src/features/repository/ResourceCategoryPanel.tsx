import { Eye, File, FileImage, FileText, LoaderCircle } from "lucide-react";
import { useState } from "react";
import type { PublicResource } from "../../contracts/resource";
import { authorizePublicResourcePreview } from "../../services/publicResourcePreview";
import {
  formatResourceDate,
  formatResourceFileSize,
} from "../../utils/formatResourceMetadata";
import type { ResourceCategoryGroup } from "./groupResourcesByCategory";
import { PublicResourcePreviewDialog } from "./PublicResourcePreviewDialog";

type ResourceCategoryPanelProps = {
  group: ResourceCategoryGroup;
};

const fileTypeDetails = {
  pdf: { icon: FileText, label: "PDF" },
  xlsx: { icon: File, label: "File" },
  image: { icon: FileImage, label: "IMG" },
} as const;

type ResourceRowProps = {
  resource: PublicResource;
  isPending: boolean;
  error?: string;
  onPreview: (resource: PublicResource) => void;
};

function ResourceRow({
  resource,
  isPending,
  error,
  onPreview,
}: ResourceRowProps) {
  const details = fileTypeDetails[resource.fileType];
  const FileIcon = details.icon;

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
              <dd>{formatResourceFileSize(resource.fileSize)}</dd>
            </div>
            <div className="flex gap-1">
              <dt className="sr-only">Uploaded</dt>
              <dd>Uploaded {formatResourceDate(resource.uploadedAt)}</dd>
            </div>
          </dl>
          {resource.fileType === "xlsx" ? (
            <p className="mt-4 text-xs leading-5 text-muted-foreground">
              Online preview is not available for spreadsheet files. Public
              downloads are disabled.
            </p>
          ) : (
            <div className="mt-4">
              <button
                type="button"
                onClick={() => onPreview(resource)}
                disabled={isPending}
                className="inline-flex min-h-10 cursor-pointer items-center justify-center gap-2 rounded-xl border border-primary px-4 text-sm font-semibold text-primary transition-colors hover:bg-primary-soft focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:cursor-wait disabled:opacity-60"
              >
                {isPending ? (
                  <LoaderCircle
                    className="size-4 animate-spin motion-reduce:animate-none"
                    aria-hidden="true"
                  />
                ) : (
                  <Eye className="size-4" aria-hidden="true" />
                )}
                {isPending ? "Opening..." : "View file"}
              </button>
              <p className="mt-2 text-xs leading-5 text-muted-foreground">
                Public view mode is available. Download is restricted.
              </p>
              {error ? (
                <p
                  className="mt-2 text-xs font-medium text-destructive"
                  role="alert"
                >
                  {error}
                </p>
              ) : null}
            </div>
          )}
        </div>
      </div>
    </li>
  );
}

export function ResourceCategoryPanel({ group }: ResourceCategoryPanelProps) {
  const [pendingId, setPendingId] = useState<string>();
  const [preview, setPreview] = useState<{
    resource: PublicResource;
    url: string;
  }>();
  const [previewError, setPreviewError] = useState<{
    id: string;
    message: string;
  }>();

  async function handlePreview(resource: PublicResource) {
    setPendingId(resource.id);
    setPreviewError(undefined);

    try {
      const access = await authorizePublicResourcePreview(resource.id);
      setPreview({ resource, url: access.url });
    } catch (error) {
      setPreviewError({
        id: resource.id,
        message:
          error instanceof Error
            ? error.message
            : "The file preview could not be opened.",
      });
    } finally {
      setPendingId(undefined);
    }
  }

  return (
    <>
      <article
        className="min-w-0"
        aria-label={
          group.isSectionRoot ? `${group.sectionTitle} files` : undefined
        }
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
              <ResourceRow
                key={resource.id}
                resource={resource}
                isPending={pendingId === resource.id}
                error={
                  previewError?.id === resource.id
                    ? previewError.message
                    : undefined
                }
                onPreview={handlePreview}
              />
            ))}
          </ul>
        </div>
      </article>
      {preview ? (
        <PublicResourcePreviewDialog
          resource={preview.resource}
          url={preview.url}
          onClose={() => setPreview(undefined)}
        />
      ) : null}
    </>
  );
}
