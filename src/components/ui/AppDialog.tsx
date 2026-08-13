import { X } from "lucide-react";
import { type ReactNode, useEffect, useRef } from "react";

type AppDialogProps = {
  title: string;
  description?: string;
  children: ReactNode;
  onClose: () => void;
};

export function AppDialog({
  title,
  description,
  children,
  onClose,
}: AppDialogProps) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    dialog.showModal();
    return () => dialog.close();
  }, []);

  return (
    <dialog
      ref={ref}
      onCancel={(event) => {
        event.preventDefault();
        onClose();
      }}
      onClick={(event) => {
        if (event.target === ref.current) onClose();
      }}
      className="m-auto w-[calc(100%-2rem)] max-w-lg border border-strong-border bg-surface p-0 text-foreground shadow-2xl backdrop:bg-black/45"
    >
      <div className="flex items-start justify-between gap-5 border-b border-border px-5 py-4 sm:px-6">
        <div>
          <h2 className="font-serif text-2xl tracking-tight">{title}</h2>
          {description ? (
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              {description}
            </p>
          ) : null}
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close dialog"
          className="-mr-2 inline-flex size-10 shrink-0 cursor-pointer items-center justify-center text-muted-foreground hover:bg-primary-soft hover:text-primary focus-visible:outline-2 focus-visible:outline-primary"
        >
          <X className="size-5" />
        </button>
      </div>
      {children}
    </dialog>
  );
}
