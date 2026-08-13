import { Download, ExternalLink, FileSpreadsheet, X } from "lucide-react";
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
          className="mt-5 max-h-[36rem] w-auto max-w-full border border-border bg-background object-contain"
        />
      ) : null}
      {resource.fileType === "pdf" && resource.previewUrl ? (
        <iframe
          src={resource.previewUrl}
          title={`PDF preview: ${resource.filename}`}
          className="mt-5 h-[32rem] w-full border border-border bg-background"
        />
      ) : null}
      {resource.fileType === "xlsx" ? (
        <div className="mt-5 flex items-start gap-4 border border-border bg-surface-secondary px-5 py-6">
          <FileSpreadsheet
            className="size-7 shrink-0 text-primary"
            aria-hidden="true"
          />
          <div>
            <p className="font-semibold">
              Spreadsheet preview is not available
            </p>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              Download the Excel workbook and open it with your spreadsheet
              program.
            </p>
          </div>
        </div>
      ) : null}
      <div className="mt-5 flex flex-wrap gap-4">
        <a
          href={resource.downloadUrl}
          className="inline-flex min-h-11 items-center gap-2 bg-primary px-5 text-sm font-semibold text-primary-foreground"
        >
          <Download className="size-4" aria-hidden="true" />
          Download file
        </a>
        {resource.previewUrl ? (
          <a
            href={resource.previewUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex min-h-11 items-center gap-2 border border-primary px-5 text-sm font-semibold text-primary"
          >
            <ExternalLink className="size-4" aria-hidden="true" />
            Open in new tab
          </a>
        ) : null}
      </div>
    </div>
  );
}
