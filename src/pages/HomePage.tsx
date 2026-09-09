import { ArrowRight, RefreshCw } from "lucide-react";
import { Link } from "react-router-dom";
import { useRepositoryStructureQuery } from "../features/repository/useRepositoryStructureQuery";

export function HomePage() {
  const structure = useRepositoryStructureQuery();

  return (
    <section className="border-b border-border bg-[#fcfdfb]" aria-labelledby="home-title">
      <div className="mx-auto grid max-w-content gap-10 px-5 py-10 sm:px-8 sm:py-14 lg:min-h-[38rem] lg:grid-cols-[minmax(0,0.85fr)_minmax(30rem,1.15fr)] lg:items-center lg:gap-12 lg:px-10 lg:py-16">
        <div className="max-w-[43rem] text-left">
          <h1 id="home-title" className="max-w-[21rem] break-words font-serif text-[2.35rem] leading-[1.04] tracking-[-0.04em] text-foreground min-[23rem]:text-[2.5rem] sm:max-w-none sm:text-6xl sm:leading-[0.98] lg:text-[3.4rem]">
            CPSU Planning Information Hub
          </h1>
          <p className="mt-5 max-w-xl text-base leading-7 text-muted-foreground sm:mt-7 sm:text-lg sm:leading-8">
            Find planning reports, statistics, and performance records.
          </p>
          <div className="mt-7 flex flex-col items-start justify-start gap-3 sm:mt-9 sm:flex-row sm:items-center sm:gap-5">
            <Link to="/repository" className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-primary px-6 text-sm font-semibold text-primary-foreground shadow-[0_10px_24px_rgba(20,83,45,0.18)] transition-colors hover:bg-primary-hover focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-primary min-[23rem]:w-auto">
              Browse resources
              <ArrowRight className="size-4" aria-hidden="true" />
            </Link>
            <Link to="/about" className="inline-flex items-center gap-2 border-b border-primary pb-1 text-sm font-semibold text-primary focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary">
              About the office
              <ArrowRight className="size-4" aria-hidden="true" />
            </Link>
          </div>
        </div>

        <aside className="rounded-2xl border border-border bg-surface p-5 shadow-[0_18px_50px_rgba(20,83,45,0.08)] sm:p-6" aria-labelledby="section-directory-title">
          <div className="flex items-end gap-5 border-b border-strong-border pb-4">
            <h2 id="section-directory-title" className="text-xl font-semibold tracking-tight sm:text-2xl">
              Browse by section
            </h2>
            <span className="mb-2 hidden h-px flex-1 bg-primary/65 sm:block" aria-hidden="true" />
          </div>

          {structure.isPending ? (
            <div className="flex min-h-40 items-center justify-center gap-3 text-sm text-muted-foreground" role="status">
              <RefreshCw className="size-4 animate-spin motion-reduce:animate-none" aria-hidden="true" />
              Loading sections...
            </div>
          ) : null}

          {structure.isError ? (
            <div className="py-8">
              <p className="text-sm text-muted-foreground">Sections are unavailable.</p>
              <button type="button" onClick={() => structure.refetch()} className="mt-4 inline-flex min-h-10 cursor-pointer items-center gap-2 border border-primary px-4 text-sm font-semibold text-primary hover:bg-primary-soft">
                <RefreshCw className="size-4" aria-hidden="true" />
                Try again
              </button>
            </div>
          ) : null}

          {structure.isSuccess && structure.data.length === 0 ? (
            <p className="py-8 text-sm text-muted-foreground">No sections yet.</p>
          ) : null}

          {structure.isSuccess && structure.data.length > 0 ? (
            <ol className="mt-2 divide-y divide-border">
              {structure.data.map((section, index) => {
                const categoryCount = section.categories.length;

                return (
                  <li key={section.id}>
                    <Link to={`/repository?section=${encodeURIComponent(section.id)}`} className="group grid min-h-16 grid-cols-[2.5rem_minmax(0,1fr)_auto] items-center gap-3 px-2 py-3 hover:bg-primary-soft focus-visible:bg-primary-soft focus-visible:outline-2 focus-visible:outline-primary">
                      <span className="text-xs font-bold tabular-nums tracking-[0.12em] text-primary" aria-hidden="true">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <span>
                        <span className="block text-sm font-semibold leading-5 text-foreground group-hover:text-primary sm:text-base">
                          {section.title}
                        </span>
                        <span className="mt-0.5 block text-xs text-muted-foreground">
                          {categoryCount === 0
                            ? "No subcategories"
                            : `${categoryCount} ${categoryCount === 1 ? "category" : "categories"}`}
                        </span>
                      </span>
                      <ArrowRight className="size-4 text-primary transition-transform group-hover:translate-x-1" aria-hidden="true" />
                    </Link>
                  </li>
                );
              })}
            </ol>
          ) : null}
        </aside>
      </div>
    </section>
  );
}
