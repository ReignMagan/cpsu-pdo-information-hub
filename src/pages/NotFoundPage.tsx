import { Link } from "react-router-dom";

export function NotFoundPage() {
  return (
    <section
      className="mx-auto max-w-readable px-5 py-14 sm:px-8"
      aria-labelledby="not-found-title"
    >
      <p className="text-sm font-semibold tracking-[0.12em] text-primary">
        404
      </p>
      <h1
        id="not-found-title"
        className="mt-3 font-serif text-4xl tracking-tight"
      >
        Page not found
      </h1>
      <p className="mt-5 max-w-xl leading-7 text-muted-foreground">
        Check the address or return home.
      </p>
      <Link
        className="mt-8 inline-flex border-b border-primary pb-1 font-semibold text-primary"
        to="/"
      >
        Return home
      </Link>
    </section>
  );
}
