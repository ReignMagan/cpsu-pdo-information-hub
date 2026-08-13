import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, LockKeyhole } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import cpsuLogo from "../../assets/CPSU_Logo-transparent.png";
import { useAuth } from "../../features/auth/useAuth";
import { getAuthenticationErrorMessage } from "../../features/auth/authErrors";
import { loginSchema, type LoginValues } from "../../features/auth/authSchema";

function getSafeDestination(state: unknown) {
  if (
    typeof state === "object" &&
    state !== null &&
    "from" in state &&
    typeof state.from === "string" &&
    state.from.startsWith("/admin") &&
    state.from !== "/admin/login"
  )
    return state.from;
  return "/admin";
}

export function AdminLoginPage() {
  const { configurationError, signIn, status, user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [authenticationError, setAuthenticationError] = useState<string | null>(
    null,
  );
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  if (status === "authenticated" && user)
    return <Navigate to={getSafeDestination(location.state)} replace />;

  async function submitLogin(values: LoginValues) {
    setAuthenticationError(null);
    try {
      await signIn(values.email, values.password);
      navigate(getSafeDestination(location.state), { replace: true });
    } catch (error) {
      setAuthenticationError(getAuthenticationErrorMessage(error));
    }
  }

  return (
    <main className="min-h-screen bg-background px-5 py-5 text-foreground sm:px-8 sm:py-7">
      <div className="mx-auto max-w-6xl">
        <Link
          to="/"
          className="inline-flex items-center gap-2 border-b border-primary pb-1 text-sm font-semibold text-primary focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary"
        >
          <ArrowLeft className="size-4" aria-hidden="true" />
          Return to public site
        </Link>
        <div className="mt-6 grid overflow-hidden border border-strong-border bg-surface lg:grid-cols-[0.82fr_1.18fr]">
          <section
            className="border-b border-border bg-primary px-7 py-8 text-primary-foreground sm:px-9 lg:border-b-0 lg:border-r lg:py-10"
            aria-labelledby="login-context-title"
          >
            <img
              src={cpsuLogo}
              alt=""
              className="size-16 object-contain"
              width="500"
              height="500"
            />
            <p className="mt-8 text-xs font-bold tracking-[0.15em] text-primary-foreground/75">
              CENTRAL PHILIPPINES STATE UNIVERSITY
            </p>
            <h1
              id="login-context-title"
              className="mt-4 font-serif text-4xl leading-tight sm:text-5xl"
            >
              Planning and Development Office
            </h1>
            <p className="mt-6 max-w-md leading-7 text-primary-foreground/80">
              A private workspace for staff who maintain the office repository.
            </p>
          </section>
          <section
            className="px-7 py-8 sm:px-10 lg:px-12 lg:py-10"
            aria-labelledby="login-form-title"
          >
            <div className="flex items-center gap-3">
              <LockKeyhole className="size-5 text-primary" aria-hidden="true" />
              <h2
                id="login-form-title"
                className="font-serif text-3xl tracking-tight sm:text-4xl"
              >
                Staff Sign in
              </h2>
            </div>
            <p className="mt-4 leading-7 text-muted-foreground">
            </p>
            {configurationError ? (
              <div
                className="mt-7 border-l-2 border-warning bg-warning-soft px-4 py-3 text-sm leading-6 text-foreground"
                role="status"
              >
                <p className="font-semibold">Sign-in is temporarily unavailable</p>
                <p className="mt-1 text-muted-foreground">
                  Please contact the person responsible for maintaining this
                  website.
                </p>
              </div>
            ) : null}
            <form
              className="mt-8 space-y-6"
              onSubmit={handleSubmit(submitLogin)}
              noValidate
            >
              <div>
                <label
                  htmlFor="admin-email"
                  className="block text-sm font-semibold"
                >
                  Email address
                </label>
                <input
                  id="admin-email"
                  type="email"
                  autoComplete="username"
                  aria-invalid={Boolean(errors.email)}
                  aria-describedby={
                    errors.email ? "admin-email-error" : undefined
                  }
                  className="mt-2 min-h-12 w-full border border-strong-border bg-surface px-4 text-base outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20"
                  {...register("email")}
                />
                {errors.email ? (
                  <p
                    id="admin-email-error"
                    className="mt-2 text-sm text-danger"
                  >
                    {errors.email.message}
                  </p>
                ) : null}
              </div>
              <div>
                <label
                  htmlFor="admin-password"
                  className="block text-sm font-semibold"
                >
                  Password
                </label>
                <input
                  id="admin-password"
                  type="password"
                  autoComplete="current-password"
                  aria-invalid={Boolean(errors.password)}
                  aria-describedby={
                    errors.password ? "admin-password-error" : undefined
                  }
                  className="mt-2 min-h-12 w-full border border-strong-border bg-surface px-4 text-base outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20"
                  {...register("password")}
                />
                {errors.password ? (
                  <p
                    id="admin-password-error"
                    className="mt-2 text-sm text-danger"
                  >
                    {errors.password.message}
                  </p>
                ) : null}
              </div>
              {authenticationError ? (
                <p
                  className="border-l-2 border-danger bg-danger-soft px-4 py-3 text-sm text-danger"
                  role="alert"
                >
                  {authenticationError}
                </p>
              ) : null}
              <button
                type="submit"
                disabled={isSubmitting || Boolean(configurationError)}
                className="inline-flex min-h-12 w-full cursor-pointer items-center justify-center bg-primary px-6 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary-hover focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-primary disabled:cursor-not-allowed disabled:opacity-55 sm:w-auto"
              >
                {isSubmitting ? "Signing in…" : "Sign in securely"}
              </button>
            </form>
            <p className="mt-8 border-t border-border pt-5 text-sm leading-6 text-muted-foreground">
              Need an account? Contact an existing administrator.
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
