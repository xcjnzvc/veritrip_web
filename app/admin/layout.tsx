import RefineProvider from "./RefineProvider";

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  return <RefineProvider>{children}</RefineProvider>;
}

