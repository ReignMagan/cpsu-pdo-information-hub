import { LogIn, Menu, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { NavLink } from "react-router-dom";
import cpsuLogo from "../../assets/CPSU_Logo-transparent.png";
import { publicNavigation } from "../../config/navigation";

const mobileLinkClassName = ({ isActive }: { isActive: boolean }) =>
  `flex min-h-11 cursor-pointer items-center rounded-xl border-l-2 px-4 py-2.5 text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-inset focus-visible:outline-primary ${
    isActive
      ? "border-primary bg-primary-soft text-primary"
      : "border-transparent text-foreground hover:border-strong-border hover:bg-surface-secondary hover:text-primary"
  }`;

const desktopLinkClassName = ({ isActive }: { isActive: boolean }) =>
  `relative flex min-h-11 cursor-pointer items-center px-2 text-xs font-medium transition-colors after:absolute after:inset-x-2 after:bottom-0 after:h-0.5 after:rounded-full after:transition-colors focus-visible:rounded-lg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary lg:px-3 lg:text-sm lg:after:inset-x-3 ${
    isActive
      ? "text-primary after:bg-primary"
      : "text-muted-foreground after:bg-transparent hover:text-primary hover:after:bg-primary/30"
  }`;

export function PublicHeader() {
  const [menuOpen, setMenuOpen] = useState(false);
  const headerContentRef = useRef<HTMLDivElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!menuOpen) return;

    function closeOnOutsideClick(event: MouseEvent) {
      if (
        event.target instanceof Node &&
        !headerContentRef.current?.contains(event.target)
      ) {
        setMenuOpen(false);
      }
    }

    function closeOnEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setMenuOpen(false);
        menuButtonRef.current?.focus();
      }
    }

    document.addEventListener("mousedown", closeOnOutsideClick);
    document.addEventListener("keydown", closeOnEscape);

    return () => {
      document.removeEventListener("mousedown", closeOnOutsideClick);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, [menuOpen]);

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-surface shadow-[0_8px_28px_rgba(20,83,45,0.06)]">
      <div
        ref={headerContentRef}
        className="relative mx-auto flex min-h-16 max-w-content items-center justify-between gap-3 px-4 py-2 sm:min-h-[4.5rem] sm:px-8 lg:px-10"
      >
        <NavLink
          to="/"
          className="flex min-w-0 flex-1 items-center gap-2 overflow-hidden focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary sm:gap-3 md:max-w-[18rem] lg:max-w-none"
          aria-label="CPSU Planning and Development Office Information Hub home"
          onClick={() => setMenuOpen(false)}
        >
          <img
            src={cpsuLogo}
            alt=""
            width="500"
            height="500"
            className="size-10 shrink-0 object-contain sm:size-12"
          />
          <span className="min-w-0 overflow-hidden">
            <span className="block truncate text-[0.56rem] font-bold leading-4 tracking-[0.1em] text-primary min-[23rem]:text-[0.6rem] sm:text-xs sm:tracking-[0.12em] md:hidden lg:block">
              CENTRAL PHILIPPINES STATE UNIVERSITY
            </span>
            <span className="hidden text-xs font-bold tracking-[0.12em] text-primary md:block lg:hidden">
              CPSU
            </span>
            <span className="mt-0.5 block truncate text-[0.66rem] leading-4 text-muted-foreground min-[23rem]:text-[0.7rem] sm:text-sm md:hidden lg:block">
              Planning and Development Office
            </span>
            <span className="mt-0.5 hidden truncate text-xs text-muted-foreground md:block lg:hidden">
              Planning &amp; Development
            </span>
          </span>
        </NavLink>

        <nav
          aria-label="Primary navigation"
          className="hidden shrink-0 items-center gap-0.5 md:flex lg:gap-1"
        >
          {publicNavigation.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === "/"}
              className={desktopLinkClassName}
            >
              {item.label}
            </NavLink>
          ))}
          <NavLink
            to="/admin/login"
            aria-label="Administrator login"
            className="ml-1 inline-flex min-h-11 shrink-0 cursor-pointer items-center justify-center gap-2 rounded-xl bg-primary-soft px-3 text-xs font-semibold text-primary hover:bg-primary hover:text-primary-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary lg:ml-2 lg:px-4 lg:text-sm"
          >
            <LogIn className="size-4" aria-hidden="true" />
            <span className="hidden lg:inline">Login</span>
            <span className="lg:hidden">Admin</span>
          </NavLink>
        </nav>

        <button
          ref={menuButtonRef}
          type="button"
          className="inline-flex size-11 shrink-0 cursor-pointer items-center justify-center rounded-xl border-0 bg-primary-soft text-primary transition-colors hover:bg-primary hover:text-primary-foreground focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-primary md:hidden"
          aria-expanded={menuOpen}
          aria-controls="mobile-public-navigation"
          aria-haspopup="true"
          aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"}
          onClick={() => setMenuOpen((current) => !current)}
        >
          {menuOpen ? (
            <X className="size-4" aria-hidden="true" />
          ) : (
            <Menu className="size-4" aria-hidden="true" />
          )}
        </button>

        <nav
          id="mobile-public-navigation"
          aria-label="Mobile primary navigation"
          aria-hidden={!menuOpen}
          className={`${menuOpen ? "block" : "hidden"} absolute inset-x-4 top-[calc(100%+0.65rem)] max-h-[calc(100dvh-5rem)] overflow-y-auto rounded-2xl border border-border bg-surface p-2 shadow-[0_22px_60px_rgba(20,83,45,0.16)] sm:left-auto sm:right-8 sm:w-96 md:hidden`}
        >
          <p className="px-4 pb-2 pt-1 text-[0.68rem] font-bold tracking-[0.14em] text-muted-foreground">
            NAVIGATION
          </p>
          {publicNavigation.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === "/"}
              className={mobileLinkClassName}
              onClick={() => setMenuOpen(false)}
              tabIndex={menuOpen ? 0 : -1}
            >
              {item.label}
            </NavLink>
          ))}
          <div className="mt-2 border-t border-border pt-2">
            <NavLink
              to="/admin/login"
              className="flex min-h-11 cursor-pointer items-center gap-3 rounded-xl border-l-2 border-transparent px-4 py-2.5 text-sm font-semibold text-primary transition-colors hover:border-primary hover:bg-primary-soft focus-visible:outline-2 focus-visible:outline-inset focus-visible:outline-primary"
              onClick={() => setMenuOpen(false)}
              tabIndex={menuOpen ? 0 : -1}
            >
              <LogIn className="size-4" aria-hidden="true" />
              Administrator Login
            </NavLink>
          </div>
        </nav>
      </div>
    </header>
  );
}
