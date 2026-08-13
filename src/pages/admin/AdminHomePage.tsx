import {
  FileImage,
  FileSpreadsheet,
  FileText,
  FolderArchive,
  HardDrive,
  Upload,
  Users,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useAdminResourcesQuery } from "../../features/admin/useAdminResourcesQuery";
import { useAdministratorsQuery } from "../../features/admin/useAdministratorsQuery";

function formatSize(bytes: number) {
  if (bytes < 1_048_576) return `${(bytes / 1_024).toFixed(1)} KB`;
  if (bytes < 1_073_741_824) return `${(bytes / 1_048_576).toFixed(1)} MB`;
  return `${(bytes / 1_073_741_824).toFixed(2)} GB`;
}
export function AdminHomePage() {
  const resources = useAdminResourcesQuery({ limit: 100, sort: "newest" });
  const users = useAdministratorsQuery();
  const data = resources.data?.data ?? [];
  const summary = [
    {
      label: "Total resources",
      value: resources.data?.meta.total ?? "—",
      icon: FolderArchive,
    },
    {
      label: "PDF",
      value: data.filter((item) => item.fileType === "pdf").length,
      icon: FileText,
    },
    {
      label: "Excel",
      value: data.filter((item) => item.fileType === "xlsx").length,
      icon: FileSpreadsheet,
    },
    {
      label: "Images",
      value: data.filter((item) => item.fileType === "image").length,
      icon: FileImage,
    },
    {
      label: "Storage used",
      value: resources.isSuccess
        ? formatSize(data.reduce((total, item) => total + item.fileSize, 0))
        : "—",
      icon: HardDrive,
    },
  ];
  return (
    <section className="mt-10" aria-labelledby="admin-home-title">
      <div className="flex flex-wrap items-end justify-between gap-5">
        <div>
          <h1
            id="admin-home-title"
            className="font-serif text-4xl tracking-tight sm:text-5xl"
          >
            Manage the repository
          </h1>
          <p className="mt-3 text-muted-foreground">
            Publish files, organize repository records, and manage staff access.
          </p>
        </div>
        <Link
          to="/admin/resources/upload"
          className="inline-flex min-h-11 items-center gap-2 bg-primary px-5 text-sm font-semibold text-primary-foreground"
        >
          <Upload className="size-4" />
          Upload a resource
        </Link>
      </div>
      <div className="mt-8 grid border-l border-t border-strong-border sm:grid-cols-2 xl:grid-cols-5">
        {summary.map(({ label, value, icon: Icon }) => (
          <div
            key={label}
            className="border-b border-r border-strong-border bg-surface p-5"
          >
            <Icon className="size-6 text-primary" />
            <p className="mt-5 font-serif text-3xl">{value}</p>
            <p className="mt-1 text-sm text-muted-foreground">{label}</p>
          </div>
        ))}
      </div>
      <div className="mt-8 grid gap-6 xl:grid-cols-[1.5fr_0.8fr]">
        <section className="border border-strong-border bg-surface">
          <div className="flex items-center justify-between border-b border-strong-border p-5">
            <h2 className="font-serif text-2xl">Recent resources</h2>
            <Link
              to="/admin/resources"
              className="text-sm font-semibold text-primary underline"
            >
              Manage all
            </Link>
          </div>
          <ul className="divide-y divide-border">
            {data.slice(0, 5).map((resource) => (
              <li key={resource.key} className="p-5">
                <p className="break-all text-sm font-semibold">
                  {resource.filename}
                </p>
                <p className="mt-2 text-xs text-muted-foreground">
                  {resource.year} · {resource.fileType === "xlsx" ? "Excel" : resource.fileType === "pdf" ? "PDF" : "Image"}
                </p>
              </li>
            ))}
          </ul>
          {resources.isSuccess && !data.length ? (
            <p className="p-6 text-muted-foreground">
              No resources have been published yet.
            </p>
          ) : null}
        </section>
        <section className="border border-strong-border bg-surface p-6">
          <Users className="size-7 text-primary" />
          <p className="mt-6 font-serif text-4xl">
            {users.data?.length ?? "—"}
          </p>
          <h2 className="mt-2 font-serif text-2xl">Staff access</h2>
          <p className="mt-3 leading-7 text-muted-foreground">
            People who can publish files and maintain the repository.
          </p>
          <Link
            to="/admin/users"
            className="mt-6 inline-flex min-h-11 items-center border border-primary px-4 text-sm font-semibold text-primary"
          >
            Manage staff access
          </Link>
        </section>
      </div>
    </section>
  );
}
