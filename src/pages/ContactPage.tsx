import { Clock3, Mail, MapPin, Phone } from "lucide-react";
import { Link } from "react-router-dom";

const placeholderContactDetails = [
  {
    label: "Office address",
    value: "[Campus building and room number]",
    note: "Central Philippines State University, Kabankalan City",
    icon: MapPin,
  },
  {
    label: "Email address",
    value: "cpsu_pdo@cpsu.edu.ph",  
    icon: Mail,
  },
  {
    label: "Telephone",
    value: "[(034) XXX-XXXX]",
    note: "Replace with the office's verified contact number.",
    icon: Phone,
  },
  {
    label: "Office hours",
    value: "[Monday-Friday, 8:00 AM-5:00 PM]",
    note: "Replace with the office's confirmed operating hours.",
    icon: Clock3,
  },
] as const;

export function ContactPage() {
  return (
    <section
      className="mx-auto max-w-content px-5 py-8 sm:px-8 sm:py-12 lg:px-10 lg:py-14"
      aria-labelledby="contact-title"
    >
      <nav aria-label="Breadcrumb" className="text-sm text-muted-foreground">
        <Link className="hover:text-primary hover:underline" to="/">
          Home
        </Link>
        <span className="mx-2" aria-hidden="true">
          /
        </span>
        <span aria-current="page">Contact</span>
      </nav>
      <div className="mt-6 max-w-3xl border-l-2 border-primary pl-4 sm:pl-5">
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-primary">
          Contact
        </p>
        <h1
          id="contact-title"
          className="mt-2 font-serif text-3xl tracking-tight sm:text-[2.5rem]"
        >
          Planning and Development Office
        </h1>
        <p className="mt-4 max-w-2xl text-base leading-7 text-muted-foreground">
          Questions about the repository? Contact the office.
        </p>
      </div>
      <div className="mt-9 rounded-xl border border-amber-300 bg-amber-50 px-5 py-4 text-sm leading-6 text-amber-950">
        <strong>Draft:</strong> Confirm these details before publication.
      </div>
      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        {placeholderContactDetails.map(({ label, value, icon: Icon }) => (
          <article
            key={label}
            className="flex gap-4 rounded-2xl border border-border bg-surface p-5 shadow-[0_8px_24px_rgba(20,83,45,0.04)] sm:p-6"
          >
            <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-primary-soft text-primary">
              <Icon className="size-5" aria-hidden="true" />
            </span>
            <div>
              <h2 className="text-sm font-semibold text-foreground">{label}</h2>
              <p className="mt-1 font-medium text-foreground">{value}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
