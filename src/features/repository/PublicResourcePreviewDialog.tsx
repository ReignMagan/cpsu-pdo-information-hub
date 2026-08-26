import type { PublicResource } from "../../contracts/resource";
import { AppDialog } from "../../components/ui/AppDialog";

type PublicResourcePreviewDialogProps = {
  resource: PublicResource;
  url: string;
  onClose: () => void;
};

export function PublicResourcePreviewDialog({
  resource,
  url,
  onClose,
}: PublicResourcePreviewDialogProps) {
  return (
    <AppDialog
      title={resource.displayName}
      description="Public view mode. A download action is not provided."
      onClose={onClose}
      size="wide"
    >
      <div className="bg-surface-secondary p-3 sm:p-5">
        {resource.fileType === "image" ? (
          <img
            src={url}
            alt={`Preview of ${resource.displayName}`}
            className="mx-auto max-h-[70dvh] rounded-xl object-contain"
          />
        ) : (
          <iframe
            src={url}
            title={`Preview of ${resource.displayName}`}
            className="h-[70dvh] min-h-96 w-full rounded-xl border border-border bg-white"
          />
        )}
      </div>
    </AppDialog>
  );
}
