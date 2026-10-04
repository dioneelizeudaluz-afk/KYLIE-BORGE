import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import Logo from "../components/Logo";
import Container from "../components/ui/Container";
import { useAuth } from "../auth/useAuth";

interface MenuItem {
  to: string;
  label: string;
  end?: boolean;
}

const items: MenuItem[] = [
  { to: "/admin", label: "Dashboard", end: true },
  { to: "/admin/contents", label: "Conteudos" },
  { to: "/admin/codes", label: "Codigos" },
  { to: "/admin/clients", label: "Clientes" },
  { to: "/admin/payments", label: "Pagamentos" },
  { to: "/admin/plans", label: "Planos" }
];

function navClass(isActive: boolean): string {
  return [
    "whitespace-nowrap rounded-full border px-3 py-1.5 text-xs transition-colors",
    isActive
      ? "border-kb-rose/50 bg-kb-rose/10 text-kb-roseSoft"
      : "border-kb-line text-kb-gray hover:border-kb-rose/40 hover:text-kb-rose"
  ].join(" ");
}

export default function AdminLayout() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  async function handleSignOut() {
    try {
      await signOut();
      navigate("/", { replace: true });
    } catch {
      // ignora
    }
  }

  return (
    <div className="relative min-h-screen bg-kb-black text-kb-white">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[400px] bg-kb-radial" />

      <header className="relative z-10 border-b border-kb-line/60">
        <Container className="flex items-center justify-between gap-3 py-4">
          <Link to="/admin" className="flex items-center gap-2">
            <Logo variant="mark" className="h-9 w-9" />
            <span className="font-display text-lg tracking-[0.3em] text-kb-white">
              ADMIN
            </span>
          </Link>
          <div className="flex items-center gap-2 sm:gap-3">
            <span className="hidden text-xs text-kb-graySoft sm:inline">
              {user?.email}
            </span>
            <Link to="/" className="text-xs text-kb-gray transition-colors hover:text-kb-rose">
              Ver site
            </Link>
            <button
              type="button"
              onClick={handleSignOut}
              className="btn-ghost !px-3 !py-2 !text-xs"
            >
              Sair
            </button>
          </div>
        </Container>

        <Container className="pb-3">
          <nav className="flex gap-2 overflow-x-auto pb-1">
            {items.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) => navClass(isActive)}
              >
                {item.label}
              </NavLink>
            ))}
          </nav>
        </Container>
      </header>

      <main className="relative z-10 py-8">
        <Container>
          <Outlet />
        </Container>
      </main>
    </div>
  );
}
