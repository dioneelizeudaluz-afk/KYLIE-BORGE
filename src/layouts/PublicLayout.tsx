import { Link, Outlet } from "react-router-dom";
import Logo from "../components/Logo";
import Container from "../components/ui/Container";

export default function PublicLayout() {
  return (
    <div className="relative min-h-full bg-kb-black text-kb-white">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[600px] bg-kb-radial" />

      <header className="relative z-10">
        <Container className="flex items-center justify-between py-5">
          <Link to="/" className="flex items-center gap-3">
            <Logo variant="mark" className="h-10 w-10" />
            <span className="font-display text-xl tracking-[0.35em] text-kb-white">
              KYLIE BORGE
            </span>
          </Link>
          <nav className="hidden items-center gap-6 sm:flex">
            <Link to="/plans" className="text-sm text-kb-gray transition-colors hover:text-kb-rose">
              Planos
            </Link>
            <Link to="/age-gate" className="btn-ghost text-sm">
              Entrar
            </Link>
          </nav>
        </Container>
      </header>

      <main className="relative z-10">
        <Outlet />
      </main>

      <footer className="relative z-10 border-t border-kb-line/60 py-8">
        <Container className="flex flex-col items-center justify-between gap-3 text-xs text-kb-graySoft sm:flex-row">
          <span>© {new Date().getFullYear()} Kylie Borge</span>
          <span>Conteudo destinado a maiores de 18 anos.</span>
        </Container>
      </footer>
    </div>
  );
}
