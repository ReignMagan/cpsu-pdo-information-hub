import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, Eye, EyeOff, LockKeyhole } from "lucide-react";
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
  const [showPassword, setShowPassword] = useState(false);
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
    <main className="min-h-screen bg-background px-4 py-4 text-foreground sm:px-8 sm:py-7">
      <div className="mx-auto max-w-6xl">
        <Link
          to="/"
          className="inline-flex items-center gap-2 border-b border-primary pb-1 text-sm font-semibold text-primary focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary"
        >
          <ArrowLeft className="size-4" aria-hidden="true" />
          Public site
        </Link>
        <div className="mt-5 grid overflow-hidden rounded-3xl border border-border bg-surface shadow-[0_24px_70px_rgba(20,83,45,0.12)] sm:mt-6 lg:grid-cols-[0.82fr_1.18fr]">
          <section
            className="border-b border-border bg-primary px-5 py-6 text-primary-foreground sm:px-9 sm:py-8 lg:border-b-0 lg:border-r lg:py-10"
            aria-labelledby="login-context-title"
          >
            <img
              src={cpsuLogo}
              alt=""
              className="size-12 object-contain sm:size-16"
              width="500"
              height="500"
            />
            <p className="mt-5 text-[0.68rem] font-bold tracking-[0.12em] text-primary-foreground/75 sm:mt-8 sm:text-xs sm:tracking-[0.15em]">
              CENTRAL PHILIPPINES STATE UNIVERSITY
            </p>
            <h1
              id="login-context-title"
              className="mt-3 font-serif text-3xl leading-tight sm:mt-4 sm:text-5xl"
            >
              PDO Repository
            </h1>
            <p className="mt-3 max-w-md text-sm leading-6 text-primary-foreground/80 sm:mt-6 sm:text-base sm:leading-7">
              Private workspace for authorized staff.
            </p>
          </section>
          <section
            className="px-5 py-7 sm:px-10 sm:py-8 lg:px-12 lg:py-10"
            aria-labelledby="login-form-title"
          >
            <div className="flex items-center gap-3">
              <LockKeyhole className="size-5 text-primary" aria-hidden="true" />
              <h2
                id="login-form-title"
                className="font-serif text-2xl tracking-tight sm:text-4xl"
              >
                Staff sign in
              </h2>
            </div>
            {configurationError ? (
              <div
                className="mt-7 rounded-xl border border-warning/20 bg-warning-soft px-4 py-3 text-sm leading-6 text-foreground"
                role="status"
              >
                <p className="font-semibold">Sign-in unavailable</p>
                <p className="mt-1 text-muted-foreground">
                  Contact the site administrator.
                </p>
              </div>
            ) : null}
            <form
              className="mt-6 space-y-5 sm:mt-8 sm:space-y-6"
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
                <div className="relative mt-2">
                  <input
                    id="admin-password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    aria-invalid={Boolean(errors.password)}
                    aria-describedby={
                      errors.password ? "admin-password-error" : undefined
                    }
                    className="min-h-12 w-full border border-strong-border bg-surface py-3 pl-4 pr-14 text-base outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20"
                    {...register("password")}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((visible) => !visible)}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                    aria-pressed={showPassword}
                    className="absolute inset-y-0 right-0 inline-flex w-12 cursor-pointer items-center justify-center text-muted-foreground transition-colors hover:bg-primary-soft hover:text-primary focus-visible:outline-2 focus-visible:outline-inset focus-visible:outline-primary"
                  >
                    {showPassword ? (
                      <EyeOff className="size-5" aria-hidden="true" />
                    ) : (
                      <Eye className="size-5" aria-hidden="true" />
                    )}
                  </button>
                </div>
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
                  className="rounded-xl border border-danger/20 bg-danger-soft px-4 py-3 text-sm text-danger"
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
                {isSubmitting ? "Signing in…" : "Sign in"}
              </button>
            </form>
            <p className="mt-8 border-t border-border pt-5 text-sm leading-6 text-muted-foreground">
              Accounts are managed by administrators.
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
