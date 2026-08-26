import { Archive, FileSearch, ShieldCheck } from "lucide-react";
import { Link } from "react-router-dom";

const officeFunctions = [
  {
    title: "Institutional information",
    description:
      "Brings planning documents, statistical profiles, reports, and performance records together in one organized hub.",
    icon: Archive,
  },
  {
    title: "Resource discovery",
    description:
      "Helps visitors browse and search public resource information by section, category, year, and file type.",
    icon: FileSearch,
  },
  {
    title: "Responsible stewardship",
    description:
      "Supports secure repository management by authorized Planning and Development Office personnel.",
    icon: ShieldCheck,
  },
] as const;

export function AboutPage() {
  return (
    <>
      <section className="border-b border-border bg-surface-secondary/45">
        <div className="mx-auto max-w-content px-5 py-8 sm:px-8 sm:py-12 lg:px-10 lg:py-14">
          <nav
            aria-label="Breadcrumb"
            className="text-sm text-muted-foreground"
          >
            <Link className="hover:text-primary hover:underline" to="/">
              Home
            </Link>
            <span className="mx-2" aria-hidden="true">
              /
            </span>
            <span aria-current="page">About</span>
          </nav>
          <div className="mt-6 max-w-3xl border-l-2 border-primary pl-4 sm:pl-5">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-primary">
              About the office
            </p>
            <h1
              id="about-title"
              className="mt-2 font-serif text-3xl tracking-tight sm:text-[2.5rem]"
            >
              Planning information, organized for public access
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-7 text-muted-foreground">
              The CPSU Planning and Development Office Information Hub is a
              central access point for institutional resources maintained by the
              office.
            </p>
          </div>
        </div>
      </section>

      <section aria-labelledby="about-title">
        <div className="mx-auto grid max-w-content gap-10 px-5 py-10 sm:px-8 sm:py-14 lg:grid-cols-[minmax(0,1.25fr)_minmax(18rem,0.75fr)] lg:px-10 lg:py-16">
          <div>
            <h2 className="font-serif text-2xl tracking-tight sm:text-3xl">
              A dependable institutional reference
            </h2>
            <div className="mt-5 space-y-4 text-base leading-7 text-muted-foreground">
              <p>
                This website provides a clear, centralized way to discover
                reports, statistical information, planning documents, and
                performance records associated with Central Philippines State
                University.
              </p>
              <p>
                Public visitors can browse resource information without an
                account. Repository files and administrative operations remain
                protected and are available only to authorized office personnel.
              </p>
            </div>
            <div className="mt-9 grid gap-4 sm:grid-cols-3">
              {officeFunctions.map(({ title, description, icon: Icon }) => (
                <article
                  key={title}
                  className="rounded-2xl border border-border bg-surface p-5 shadow-[0_8px_24px_rgba(20,83,45,0.04)]"
                >
                  <span className="grid size-10 place-items-center rounded-xl bg-primary-soft text-primary">
                    <Icon className="size-5" aria-hidden="true" />
                  </span>
                  <h3 className="mt-4 font-semibold text-foreground">
                    {title}
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">
                    {description}
                  </p>
                </article>
              ))}
            </div>
          </div>
          <aside className="h-fit rounded-2xl border border-primary/20 bg-primary-soft p-6 sm:p-7">
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-primary">
              Information Hub
            </p>
            <h2 className="mt-3 text-xl font-semibold tracking-tight">
              Explore available resources
            </h2>
            <p className="mt-3 text-sm leading-6 text-muted-foreground">
              Browse the repository directory to find publicly available
              metadata for institutional resources.
            </p>
            <Link
              to="/repository"
              className="mt-6 inline-flex min-h-11 items-center justify-center rounded-xl bg-primary px-5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary-hover focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-primary"
            >
              Browse repository
            </Link>
          </aside>
        </div>
      </section>
    </>
  );
}
