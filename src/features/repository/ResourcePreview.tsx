import { Download, ExternalLink, X } from "lucide-react";
import type { Resource } from "../../contracts/resource";

type ResourcePreviewProps = { resource: Resource; onClose: () => void };

export function ResourcePreview({ resource, onClose }: ResourcePreviewProps) {
  return (
    <div className="mt-5 border-t border-border pt-5">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <p className="text-xs font-bold tracking-[0.12em] text-muted-foreground">
          RESOURCE PREVIEW
        </p>
        <button
          type="button"
          onClick={onClose}
          className="inline-flex min-h-10 cursor-pointer items-center gap-2 text-sm font-semibold text-primary"
        >
          <X className="size-4" aria-hidden="true" />
          Close preview
        </button>
      </div>
      {resource.fileType === "image" && resource.previewUrl ? (
        <img
          src={resource.previewUrl}
          alt={`Preview of ${resource.filename}`}
          className="mt-5 max-h-[36rem] w-auto max-w-full rounded-2xl border border-border bg-background object-contain"
        />
      ) : null}
      {resource.fileType === "pdf" && resource.previewUrl ? (
        <iframe
          src={resource.previewUrl}
          title={`PDF preview: ${resource.filename}`}
          className="mt-5 h-[60dvh] min-h-80 w-full rounded-2xl border border-border bg-background sm:h-[32rem]"
        />
      ) : null}
      <div className="mt-5 grid gap-3 min-[24rem]:flex min-[24rem]:flex-wrap">
        <a
          href={resource.downloadUrl}
          className="inline-flex min-h-11 items-center justify-center gap-2 bg-primary px-5 text-sm font-semibold text-primary-foreground"
        >
          <Download className="size-4" aria-hidden="true" />
          Download file
        </a>
        {resource.previewUrl ? (
          <a
            href={resource.previewUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex min-h-11 items-center justify-center gap-2 border border-primary px-5 text-sm font-semibold text-primary"
          >
            <ExternalLink className="size-4" aria-hidden="true" />
            Open in new tab
          </a>
        ) : null}
      </div>
    </div>
  );
}
