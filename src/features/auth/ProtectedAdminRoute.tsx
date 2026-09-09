import { Navigate, Outlet, useLocation } from "react-router-dom";
import { AdminSessionRequestError } from "../../services/adminSession";
import { useAuth } from "./useAuth";
import { useAdminSessionQuery } from "./useAdminSessionQuery";

export function ProtectedAdminRoute() {
  const { signOut, status, user } = useAuth();
  const administrator = useAdminSessionQuery();
  const location = useLocation();

  if (status === "initializing" || (user && administrator.isPending))
    return (
      <main className="grid min-h-screen place-items-center bg-background px-5">
        <p className="text-sm font-medium text-muted-foreground" role="status">
          Checking administrator access…
        </p>
      </main>
    );
  if (!user)
    return (
      <Navigate to="/admin/login" replace state={{ from: location.pathname }} />
    );
  if (administrator.isError) {
    const accessDenied =
      administrator.error instanceof AdminSessionRequestError &&
      administrator.error.status === 403;

    return (
      <main className="grid min-h-screen place-items-center bg-background px-5 text-foreground">
        <section className="w-full max-w-lg rounded-2xl border border-border bg-surface p-7 shadow-[0_18px_50px_rgba(20,83,45,0.1)]">
          <h1 className="font-serif text-3xl">
            {accessDenied
              ? "Access required"
              : "Access check failed"}
          </h1>
          <p className="mt-4 leading-7 text-muted-foreground">
            {accessDenied
              ? "This account is not approved for repository access."
              : "Retry. If the problem continues, contact the administrator."}
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            {!accessDenied && (
              <button
                type="button"
                onClick={() => void administrator.refetch()}
                className="min-h-11 cursor-pointer bg-primary px-5 font-semibold text-primary-foreground"
              >
                Try again
              </button>
            )}
            <button
              type="button"
              onClick={() => void signOut()}
              className={`${accessDenied ? "bg-primary text-primary-foreground" : "border border-border bg-surface text-foreground"} min-h-11 cursor-pointer px-5 font-semibold`}
            >
              Sign out
            </button>
          </div>
        </section>
      </main>
    );
  }
  return <Outlet />;
}
