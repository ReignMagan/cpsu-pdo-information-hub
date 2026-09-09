export type NavigationItem = {
  label: string;
  path: string;
};

export const publicNavigation: readonly NavigationItem[] = [
  { label: "Home", path: "/" },
  { label: "Repository", path: "/repository" },
  { label: "Accomplishments", path: "/accomplishments" },
  { label: "About", path: "/about" },
  { label: "Contact", path: "/contact" },
];
