import { ArrowRight, RefreshCw } from "lucide-react";
import { Link } from "react-router-dom";
import { HomeHeroBackground } from "../components/illustrations/HomeHeroBackground";
import { useRepositoryStructureQuery } from "../features/repository/useRepositoryStructureQuery";

export function HomePage() {
  const structure = useRepositoryStructureQuery();
  return (
    <>
      <section
        className="relative isolate overflow-hidden border-b border-border bg-[#fcfdfb]"
        aria-labelledby="home-title"
      >
        <HomeHeroBackground />
        <div className="relative z-10 mx-auto flex min-h-[31rem] max-w-content items-center px-5 py-14 text-left sm:min-h-[34rem] sm:px-8 sm:py-16 lg:min-h-[38rem] lg:px-10">
          <div className="max-w-[43rem]">
            <h1
              id="home-title"
              className="break-words font-serif text-[2.65rem] leading-[1.02] tracking-[-0.04em] text-foreground sm:text-6xl sm:leading-[0.98] lg:text-[4.75rem]"
            >
              Planning and Development Office Information Hub
            </h1>
            <p className="mt-7 max-w-xl text-base leading-8 text-muted-foreground sm:text-lg">
              A central access point for institutional reports, statistical
              profiles, planning documents, and performance records.
            </p>
            <div className="mt-9 flex flex-col items-start justify-start gap-5 sm:flex-row sm:items-center">
              <Link
                to="/repository"
                className="inline-flex min-h-12 items-center justify-center gap-2 bg-primary px-6 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary-hover focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-primary"
              >
                Browse Repository
                <ArrowRight className="size-4" aria-hidden="true" />
              </Link>
              <Link
                to="/about"
                className="inline-flex items-center gap-2 border-b border-primary pb-1 text-sm font-semibold text-primary focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary"
              >
                Learn about the office
                <ArrowRight className="size-4" aria-hidden="true" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-surface" aria-labelledby="section-directory-title">
        <div className="mx-auto max-w-content px-5 py-10 sm:px-8 sm:py-12 lg:px-10">
          <div className="flex items-end gap-6 border-b border-strong-border pb-5">
            <h2
              id="section-directory-title"
              className="text-2xl font-semibold tracking-tight sm:text-3xl"
            >
              Explore institutional information
            </h2>
            <span
              className="mb-2 hidden h-px flex-1 bg-primary/65 sm:block"
              aria-hidden="true"
            />
          </div>

          {structure.isPending ? (
            <div
              className="flex min-h-32 items-center justify-center gap-3 border-b border-border text-sm text-muted-foreground"
              role="status"
            >
              <RefreshCw
                className="size-4 animate-spin motion-reduce:animate-none"
                aria-hidden="true"
              />
              Loading repository sections...
            </div>
          ) : null}
          {structure.isError ? (
            <div className="border-b border-border py-8">
              <p className="text-sm text-muted-foreground">
                Repository sections could not be loaded.
              </p>
              <button
                type="button"
                onClick={() => structure.refetch()}
                className="mt-4 inline-flex min-h-10 cursor-pointer items-center gap-2 border border-primary px-4 text-sm font-semibold text-primary hover:bg-primary-soft"
              >
                <RefreshCw className="size-4" aria-hidden="true" />
                Try again
              </button>
            </div>
          ) : null}
          {structure.isSuccess && structure.data.length === 0 ? (
            <p className="border-b border-border py-8 text-sm text-muted-foreground">
              No repository sections have been created yet.
            </p>
          ) : null}
          {structure.isSuccess && structure.data.length > 0 ? (
            <div className="grid md:grid-cols-2">
              {structure.data.map((section) => (
                <Link
                  key={section.id}
                  to={`/repository?section=${encodeURIComponent(section.id)}`}
                  className="group grid grid-cols-[1fr_auto] gap-4 border-b border-border px-0 py-7 transition-colors hover:bg-primary-soft focus-visible:bg-primary-soft focus-visible:outline-2 focus-visible:outline-inset focus-visible:outline-primary md:px-5 md:odd:border-r"
                >
                  <span>
                    <span className="block text-base font-semibold text-foreground group-hover:text-primary">
                      {section.title}
                    </span>
                    <span className="mt-2 block text-sm leading-6 text-muted-foreground">
                      {section.categories.length > 0
                        ? section.categories
                            .map((category) => category.title)
                            .join(" · ")
                        : "No categories have been added to this section yet."}
                    </span>
                  </span>
                  <ArrowRight
                    className="mt-1 size-5 text-primary transition-transform group-hover:translate-x-1"
                    aria-hidden="true"
                  />
                </Link>
              ))}
            </div>
          ) : null}
        </div>
      </section>
    </>
  );
}
