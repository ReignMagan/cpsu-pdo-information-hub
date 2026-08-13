import {
  ChevronLeft,
  ChevronRight,
  FileSearch,
  Pencil,
  RefreshCw,
  Search,
  Trash2,
} from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useDeferredValue, useMemo, useState } from "react";
import {
  repositoryCategoryById,
  repositorySections,
} from "../../config/repository";
import type {
  ResourceFileType,
  ResourceQuery,
  ResourceSort,
} from "../../contracts/resource";
import { useAdminResourcesQuery } from "./useAdminResourcesQuery";
import { deleteResource, renameResource } from "../../services/adminOperations";
import { useAuth } from "../auth/useAuth";
import { AppDialog } from "../../components/ui/AppDialog";

const fileTypeOptions: readonly {
  value: ResourceFileType | "";
  label: string;
}[] = [
  { value: "", label: "All file types" },
  { value: "pdf", label: "PDF documents" },
  { value: "xlsx", label: "Excel workbooks" },
  { value: "image", label: "Images" },
];

const sortOptions: readonly { value: ResourceSort; label: string }[] = [
  { value: "newest", label: "Newest first" },
  { value: "oldest", label: "Oldest first" },
  { value: "name-asc", label: "Name A–Z" },
  { value: "name-desc", label: "Name Z–A" },
  { value: "file-size", label: "Largest first" },
  { value: "file-type", label: "File type" },
];

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

type PageState = { cursor?: string; history: (string | undefined)[] };

export function AdminResourceInventory() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const deferredSearch = useDeferredValue(search);
  const [section, setSection] = useState<ResourceQuery["section"]>();
  const [fileType, setFileType] = useState<ResourceFileType>();
  const [sort, setSort] = useState<ResourceSort>("newest");
  const [page, setPage] = useState<PageState>({ history: [] });
  const [renameTarget, setRenameTarget] = useState<{
    key: string;
    original: string;
    value: string;
  } | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<{
    key: string;
    filename: string;
  } | null>(null);
  const query = useMemo<Partial<ResourceQuery>>(
    () => ({
      q: deferredSearch || undefined,
      section,
      fileType,
      sort,
      cursor: page.cursor,
      limit: 25,
    }),
    [deferredSearch, fileType, page.cursor, section, sort],
  );
  const resourcesQuery = useAdminResourcesQuery(query);
  const refreshResources = () =>
    Promise.all([
      queryClient.invalidateQueries({ queryKey: ["admin-resources"] }),
      queryClient.invalidateQueries({ queryKey: ["resources"] }),
    ]);
  const renameMutation = useMutation({
    mutationFn: ({ key, filename }: { key: string; filename: string }) => {
      if (!user) throw new Error("Please sign in to rename a file.");
      return renameResource(user, key, filename);
    },
    onSuccess: async () => {
      setRenameTarget(null);
      await refreshResources();
    },
  });
  const deleteMutation = useMutation({
    mutationFn: ({
      key,
      confirmation,
    }: {
      key: string;
      confirmation: string;
    }) => {
      if (!user) throw new Error("Please sign in to delete a file.");
      return deleteResource(user, key, confirmation);
    },
    onSuccess: async () => {
      setDeleteTarget(null);
      await refreshResources();
    },
  });

  function resetPage() {
    setPage({ history: [] });
  }

  return (
    <div className="mt-6">
      <div className="grid gap-4 border-y border-strong-border bg-surface-secondary px-5 py-5 md:grid-cols-2 xl:grid-cols-[minmax(16rem,1.5fr)_repeat(3,minmax(10rem,0.7fr))]">
        <label className="relative block">
          <span className="block text-xs font-bold tracking-[0.1em] text-muted-foreground">
            SEARCH
          </span>
          <Search
            className="pointer-events-none absolute bottom-3.5 left-3 size-4 text-muted-foreground"
            aria-hidden="true"
          />
          <input
            value={search}
            onChange={(event) => {
              setSearch(event.target.value);
              resetPage();
            }}
            type="search"
            placeholder="File name, category, or school year"
            className="mt-2 min-h-11 w-full border border-strong-border bg-surface pl-10 pr-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
          />
        </label>
        <label>
          <span className="block text-xs font-bold tracking-[0.1em] text-muted-foreground">
            SECTION
          </span>
          <select
            value={section ?? ""}
            onChange={(event) => {
              setSection(
                (event.target.value || undefined) as ResourceQuery["section"],
              );
              resetPage();
            }}
            className="mt-2 min-h-11 w-full cursor-pointer border border-strong-border bg-surface px-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
          >
            <option value="">All sections</option>
            {repositorySections.map((item) => (
              <option key={item.id} value={item.id}>
                {item.title}
              </option>
            ))}
          </select>
        </label>
        <label>
          <span className="block text-xs font-bold tracking-[0.1em] text-muted-foreground">
            FILE TYPE
          </span>
          <select
            value={fileType ?? ""}
            onChange={(event) => {
              setFileType(
                (event.target.value || undefined) as
                  | ResourceFileType
                  | undefined,
              );
              resetPage();
            }}
            className="mt-2 min-h-11 w-full cursor-pointer border border-strong-border bg-surface px-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
          >
            {fileTypeOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>
        <label>
          <span className="block text-xs font-bold tracking-[0.1em] text-muted-foreground">
            SORT
          </span>
          <select
            value={sort}
            onChange={(event) => {
              setSort(event.target.value as ResourceSort);
              resetPage();
            }}
            className="mt-2 min-h-11 w-full cursor-pointer border border-strong-border bg-surface px-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
          >
            {sortOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>
      </div>

      {resourcesQuery.isPending ? (
        <div
          className="border-b border-border bg-surface px-6 py-16 text-center"
          role="status"
        >
          <RefreshCw
            className="mx-auto size-7 animate-spin text-primary motion-reduce:animate-none"
            aria-hidden="true"
          />
          <p className="mt-4 font-medium">
            Loading repository files…
          </p>
        </div>
      ) : null}
      {resourcesQuery.isError ? (
        <div
          className="border-b border-border bg-surface px-6 py-14 text-center"
          role="alert"
        >
          <h2 className="text-xl font-semibold">
            Repository files are unavailable
          </h2>
          <p className="mx-auto mt-3 max-w-xl leading-7 text-muted-foreground">
            The repository files could not be loaded. Please check your
            connection and try again. If the problem continues, contact the
            person responsible for maintaining this website.
          </p>
          <button
            type="button"
            onClick={() => resourcesQuery.refetch()}
            className="mt-6 inline-flex min-h-11 cursor-pointer items-center gap-2 border border-primary px-5 text-sm font-semibold text-primary hover:bg-primary-soft focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
          >
            <RefreshCw className="size-4" aria-hidden="true" />
            Try again
          </button>
        </div>
      ) : null}
      {resourcesQuery.isSuccess && resourcesQuery.data.data.length === 0 ? (
        <div className="border-b border-border bg-surface px-6 py-14 text-center">
          <FileSearch
            className="mx-auto size-8 text-primary"
            strokeWidth={1.5}
            aria-hidden="true"
          />
          <h2 className="mt-5 text-xl font-semibold">No matching resources</h2>
          <p className="mx-auto mt-3 max-w-xl leading-7 text-muted-foreground">
            No repository files match the current search and filters.
          </p>
        </div>
      ) : null}
      {resourcesQuery.isSuccess && resourcesQuery.data.data.length > 0 ? (
        <>
          <div className="flex flex-col gap-2 border-b border-border py-4 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
            <p>{resourcesQuery.data.meta.total} matching resources</p>
            <p>Showing up to 25 per page</p>
          </div>
          <div className="overflow-x-auto border-b border-strong-border bg-surface">
            <table className="w-full min-w-[64rem] border-collapse text-left">
              <thead>
                <tr className="border-b border-strong-border text-xs font-bold tracking-[0.1em] text-muted-foreground">
                  <th className="px-5 py-4">FILE NAME</th>
                  <th className="px-5 py-4">LOCATION</th>
                  <th className="px-5 py-4">YEAR</th>
                  <th className="px-5 py-4">TYPE</th>
                  <th className="px-5 py-4">SIZE</th>
                  <th className="px-5 py-4">UPDATED</th>
                  <th className="px-5 py-4">ACTIONS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {resourcesQuery.data.data.map((resource) => (
                  <tr
                    key={resource.key}
                    className="align-top hover:bg-primary-soft"
                  >
                    <td className="px-5 py-5">
                      <a
                        href={resource.downloadUrl}
                        className="break-all font-semibold text-primary hover:underline"
                      >
                        {resource.filename}
                      </a>
                    </td>
                    <td className="px-5 py-5 text-sm">
                      <p>
                        {repositorySections.find(
                          (item) => item.id === resource.sectionId,
                        )?.title ?? resource.sectionId}
                      </p>
                      <p className="mt-1 text-xs text-muted-foreground">
                        {resource.categoryId
                          ? repositoryCategoryById.get(resource.categoryId)?.title ?? resource.categoryId
                          : "No category"}
                      </p>
                    </td>
                    <td className="px-5 py-5 text-sm">{resource.year}</td>
                    <td className="px-5 py-5 text-sm uppercase">
                      {resource.fileType === "xlsx" ? "Excel" : resource.fileType === "pdf" ? "PDF" : "Image"}
                    </td>
                    <td className="px-5 py-5 text-sm">
                      {formatFileSize(resource.fileSize)}
                    </td>
                    <td className="px-5 py-5 text-sm">
                      {formatDate(resource.uploadedAt)}
                    </td>
                    <td className="px-5 py-5">
                      <div className="flex gap-4">
                        <button
                          onClick={() =>
                            setRenameTarget({
                              key: resource.key,
                              original: resource.filename,
                              value: resource.filename,
                            })
                          }
                          className="cursor-pointer text-sm font-semibold text-primary"
                        >
                          <Pencil className="mr-1 inline size-4" />
                          Rename
                        </button>
                        <button
                          onClick={() =>
                            setDeleteTarget({
                              key: resource.key,
                              filename: resource.filename,
                            })
                          }
                          className="cursor-pointer text-sm font-semibold text-danger"
                        >
                          <Trash2 className="mr-1 inline size-4" />
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <nav
            aria-label="Resource inventory pages"
            className="flex items-center justify-between gap-4 pt-6"
          >
            <button
              type="button"
              disabled={page.history.length === 0}
              onClick={() =>
                setPage((current) => ({
                  cursor: current.history.at(-1),
                  history: current.history.slice(0, -1),
                }))
              }
              className="inline-flex min-h-11 cursor-pointer items-center gap-2 border border-strong-border px-4 text-sm font-semibold text-primary hover:bg-primary-soft disabled:cursor-not-allowed disabled:opacity-45"
            >
              <ChevronLeft className="size-4" aria-hidden="true" />
              Previous
            </button>
            <button
              type="button"
              disabled={!resourcesQuery.data.meta.nextCursor}
              onClick={() =>
                setPage((current) => ({
                  cursor: resourcesQuery.data.meta.nextCursor ?? undefined,
                  history: [...current.history, current.cursor],
                }))
              }
              className="inline-flex min-h-11 cursor-pointer items-center gap-2 border border-primary px-4 text-sm font-semibold text-primary hover:bg-primary-soft disabled:cursor-not-allowed disabled:opacity-45"
            >
              Next
              <ChevronRight className="size-4" aria-hidden="true" />
            </button>
          </nav>
        </>
      ) : null}
      {renameTarget ? (
        <AppDialog
          title="Rename resource"
          description="Enter the complete file name. Keep the file type at the end unchanged."
          onClose={() => setRenameTarget(null)}
        >
          <form
            onSubmit={(event) => {
              event.preventDefault();
              if (renameTarget.value !== renameTarget.original)
                renameMutation.mutate({
                  key: renameTarget.key,
                  filename: renameTarget.value,
                });
            }}
            className="p-5 sm:p-6"
          >
            <label className="text-sm font-semibold">
              Filename
              <input
                autoFocus
                required
                value={renameTarget.value}
                onChange={(event) =>
                  setRenameTarget({
                    ...renameTarget,
                    value: event.target.value,
                  })
                }
                className="mt-2 min-h-12 w-full border border-strong-border px-4 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
              />
            </label>
            {renameMutation.isError ? (
              <p className="mt-3 text-sm text-danger" role="alert">
                {renameMutation.error instanceof Error
                  ? renameMutation.error.message
                  : "The resource could not be renamed."}
              </p>
            ) : null}
            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setRenameTarget(null)}
                className="min-h-11 cursor-pointer border border-strong-border px-5 font-semibold"
              >
                Cancel
              </button>
              <button
                disabled={
                  renameMutation.isPending ||
                  !renameTarget.value.trim() ||
                  renameTarget.value === renameTarget.original
                }
                className="min-h-11 cursor-pointer bg-primary px-5 font-semibold text-primary-foreground disabled:cursor-not-allowed disabled:opacity-50"
              >
                {renameMutation.isPending ? "Renaming..." : "Rename resource"}
              </button>
            </div>
          </form>
        </AppDialog>
      ) : null}
      {deleteTarget ? (
        <AppDialog
          title="Delete resource"
          description="This permanently deletes the file from the public repository."
          onClose={() => setDeleteTarget(null)}
        >
          <div className="p-5 sm:p-6">
            <p className="text-sm leading-6 text-muted-foreground">
              Are you sure you want to delete this file?
            </p>
            <p className="mt-3 break-all border-l-2 border-danger bg-danger-soft px-4 py-3 text-sm font-semibold text-foreground">
              {deleteTarget.filename}
            </p>
            {deleteMutation.isError ? (
              <p className="mt-3 text-sm text-danger" role="alert">
                {deleteMutation.error instanceof Error
                  ? deleteMutation.error.message
                  : "The resource could not be deleted."}
              </p>
            ) : null}
            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setDeleteTarget(null)}
                className="min-h-11 cursor-pointer border border-strong-border px-5 font-semibold"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => deleteMutation.mutate({ key: deleteTarget.key, confirmation: deleteTarget.filename })}
                disabled={deleteMutation.isPending}
                className="min-h-11 cursor-pointer bg-danger px-5 font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50"
              >
                {deleteMutation.isPending
                  ? "Deleting..."
                  : "Delete permanently"}
              </button>
            </div>
          </div>
        </AppDialog>
      ) : null}
    </div>
  );
}
