import { Outlet } from "react-router-dom";
import { PublicFooter } from "../components/layout/PublicFooter";
import { PublicHeader } from "../components/layout/PublicHeader";

export function PublicLayout() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <a className="skip-link" href="#main-content">
        Skip to main content
      </a>
      <PublicHeader />
      <main id="main-content">
        <Outlet />
      </main>
      <PublicFooter />
    </div>
  );
}
