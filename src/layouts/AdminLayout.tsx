import { LogOut } from "lucide-react";
import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import cpsuLogo from "../assets/CPSU_Logo-transparent.png";
import { useAuth } from "../features/auth/useAuth";

export function AdminLayout() {
  const { signOut, user } = useAuth();
  const navigate = useNavigate();
  async function handleSignOut() {
    await signOut();
    navigate("/admin/login", { replace: true });
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <a className="skip-link" href="#admin-main-content">
        Skip to main content
      </a>
      <div className="sticky top-0 z-50 bg-surface shadow-[0_1px_0_rgba(0,0,0,0.08)]">
        <header className="border-b border-border bg-surface">
          <div className="mx-auto flex min-h-[4.5rem] max-w-content items-center justify-between gap-5 px-5 py-2 sm:px-8 lg:px-10">
            <Link
              to="/admin"
              className="flex min-w-0 items-center gap-3 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary"
            >
              <img
                src={cpsuLogo}
                alt=""
                className="size-11 object-contain"
                width="500"
                height="500"
              />
              <span>
                <span className="block text-[0.65rem] font-bold tracking-[0.12em] text-primary sm:text-xs">
                  CPSU PLANNING AND DEVELOPMENT OFFICE
                </span>
                <span className="mt-0.5 block text-xs text-muted-foreground sm:text-sm">
                  Repository Management
                </span>
              </span>
            </Link>
            <button
              type="button"
              onClick={handleSignOut}
              className="inline-flex min-h-11 cursor-pointer items-center gap-2 border border-strong-border bg-surface px-4 text-sm font-semibold text-primary hover:bg-primary-soft focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-primary"
            >
              <LogOut className="size-4" aria-hidden="true" />
              <span className="hidden sm:inline">Sign out</span>
            </button>
          </div>
        </header>
        <nav
          aria-label="Repository management navigation"
          className="border-b border-border bg-surface"
        >
          <div className="mx-auto flex max-w-content gap-6 overflow-x-auto px-5 sm:px-8 lg:px-10">
            {[
              ["/admin", "Overview"],
              ["/admin/resources", "Resources"],
              ["/admin/resources/upload", "Upload resource"],
              ["/admin/structure", "Sections & categories"],
              ["/admin/users", "Staff access"],
            ].map(([to, label]) => (
              <NavLink
                key={to}
                end
                to={to}
                className={({ isActive }) =>
                  `flex min-h-12 shrink-0 cursor-pointer items-center border-b-2 text-sm font-semibold ${isActive ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-primary"}`
                }
              >
                {label}
              </NavLink>
            ))}
          </div>
        </nav>
      </div>
      <main
        id="admin-main-content"
        className="mx-auto max-w-content px-5 py-6 sm:px-8 lg:px-10 lg:py-8"
      >
        <div className="border-l-2 border-primary pl-4">
          <p className="text-xs font-bold tracking-[0.14em] text-primary">
            SIGNED IN AS
          </p>
          <p className="mt-1 break-all text-sm text-muted-foreground">
            {user?.email}
          </p>
        </div>
        <Outlet />
      </main>
    </div>
  );
}
