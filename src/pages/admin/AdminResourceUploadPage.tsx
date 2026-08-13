import { ResourceUploadForm } from "../../features/admin/ResourceUploadForm";

export function AdminResourceUploadPage() {
  return (
    <section className="mt-5" aria-labelledby="upload-title">
      <h1
        id="upload-title"
        className="font-serif text-3xl tracking-tight sm:text-4xl"
      >
        Upload resource
      </h1>
      <p className="mt-3 max-w-2xl leading-7 text-muted-foreground">
        Choose a section and school year. You may also choose a category if the file belongs to one.
      </p>
      <ResourceUploadForm />
    </section>
  );
}
