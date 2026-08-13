import { ChevronDown, LogIn, Menu, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { NavLink } from "react-router-dom";
import cpsuLogo from "../../assets/CPSU_Logo-transparent.png";
import { publicNavigation } from "../../config/navigation";

const linkClassName = ({ isActive }: { isActive: boolean }) =>
  `flex min-h-11 cursor-pointer items-center border-l-2 px-4 py-2.5 text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-inset focus-visible:outline-primary ${
    isActive
      ? "border-primary bg-primary-soft text-primary"
      : "border-transparent text-foreground hover:border-strong-border hover:bg-surface-secondary hover:text-primary"
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
    <header className="sticky top-0 z-50 border-b border-border bg-surface">
      <div
        ref={headerContentRef}
        className="relative mx-auto flex min-h-[4.5rem] max-w-content items-center justify-between gap-4 px-5 py-2 sm:px-8 lg:px-10"
      >
        <NavLink
          to="/"
          className="flex min-w-0 flex-1 items-center gap-2.5 overflow-hidden focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary sm:gap-3"
          aria-label="CPSU Planning and Development Office Information Hub home"
          onClick={() => setMenuOpen(false)}
        >
          <img
            src={cpsuLogo}
            alt=""
            width="500"
            height="500"
            className="size-11 shrink-0 object-contain sm:size-12"
          />
          <span className="min-w-0 overflow-hidden">
            <span className="block truncate text-[0.6rem] font-bold leading-4 tracking-[0.12em] text-primary sm:text-xs">
              CENTRAL PHILIPPINES STATE UNIVERSITY
            </span>
            <span className="mt-0.5 block truncate text-[0.7rem] leading-4 text-muted-foreground sm:text-sm">
              Planning and Development Office
            </span>
          </span>
        </NavLink>

        <button
          ref={menuButtonRef}
          type="button"
          className="inline-flex min-h-10 shrink-0 cursor-pointer items-center gap-2 border-0 bg-transparent px-1 text-sm font-semibold text-primary transition-colors hover:text-primary-hover focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-primary sm:px-2"
          aria-expanded={menuOpen}
          aria-controls="public-navigation"
          aria-haspopup="true"
          onClick={() => setMenuOpen((current) => !current)}
        >
          {menuOpen ? (
            <X className="size-4" aria-hidden="true" />
          ) : (
            <Menu className="size-4" aria-hidden="true" />
          )}
          <span className="hidden min-[26rem]:inline">Menu</span>
          <ChevronDown
            className={`hidden size-4 transition-transform min-[26rem]:block ${menuOpen ? "rotate-180" : ""}`}
            aria-hidden="true"
          />
        </button>

        <nav
          id="public-navigation"
          aria-label="Primary navigation"
          aria-hidden={!menuOpen}
          className={`${menuOpen ? "block" : "hidden"} absolute right-5 top-[calc(100%+0.5rem)] w-[min(24rem,calc(100vw-2.5rem))] max-h-[calc(100vh-6rem)] overflow-y-auto border border-strong-border bg-surface p-2 shadow-[0_18px_40px_rgba(23,32,26,0.16)] sm:right-8 lg:right-10`}
        >
          <p className="px-4 pb-2 pt-1 text-[0.68rem] font-bold tracking-[0.14em] text-muted-foreground">
            NAVIGATION
          </p>
          {publicNavigation.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === "/"}
              className={linkClassName}
              onClick={() => setMenuOpen(false)}
              tabIndex={menuOpen ? 0 : -1}
            >
              {item.label}
            </NavLink>
          ))}
          <div className="mt-2 border-t border-border pt-2">
            <NavLink
              to="/admin/login"
              className="flex min-h-11 cursor-pointer items-center gap-3 border-l-2 border-transparent px-4 py-2.5 text-sm font-semibold text-primary transition-colors hover:border-primary hover:bg-primary-soft focus-visible:outline-2 focus-visible:outline-inset focus-visible:outline-primary"
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
