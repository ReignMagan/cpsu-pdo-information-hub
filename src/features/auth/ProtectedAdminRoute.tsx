import { Navigate, Outlet, useLocation } from "react-router-dom";
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
  if (administrator.isError)
    return (
      <main className="grid min-h-screen place-items-center bg-background px-5 text-foreground">
        <section className="w-full max-w-lg rounded-2xl border border-border bg-surface p-7 shadow-[0_18px_50px_rgba(20,83,45,0.1)]">
          <h1 className="font-serif text-3xl">Administrator access required</h1>
          <p className="mt-4 leading-7 text-muted-foreground">
            This account has not been approved to manage the repository. Contact
            an existing administrator if you believe this is a mistake.
          </p>
          <button
            type="button"
            onClick={() => void signOut()}
            className="mt-6 min-h-11 cursor-pointer bg-primary px-5 font-semibold text-primary-foreground"
          >
            Return to sign in
          </button>
        </section>
      </main>
    );
  return <Outlet />;
}
