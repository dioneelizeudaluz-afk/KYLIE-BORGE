import { Link, Outlet, useNavigate } from "react-router-dom";
import Logo from "../components/Logo";
import Container from "../components/ui/Container";
import { useAuth } from "../auth/useAuth";

export default function PublicLayout() {
  const { session, signOut } = useAuth();
  const navigate = useNavigate();

  async function handleSignOut() {
    try {
      await signOut();
      navigate("/", { replace: true });
    } catch {
      // ignora; sessao sera limpa na proxima renderizacao
    }
  }

  return (
    <div className="relative min-h-full bg-kb-black text-kb-white">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[600px] bg-kb-radial" />

      <header className="relative z-10">
        <Container className="flex items-center justify-between gap-3 py-4 sm:py-5">
          <Link to="/" className="flex items-center gap-2 sm:gap-3 shrink-0">
            <Logo variant="mark" className="h-9 w-9 sm:h-10 sm:w-10" />
            <span className="hidden font-display text-lg tracking-[0.3em] text-kb-white sm:inline sm:text-xl sm:tracking-[0.35em]">
              KYLIE BORGE
            </span>
          </Link>

          <nav className="flex items-center gap-2 sm:gap-4">
            <Link
              to="/plans"
              className="text-xs text-kb-gray transition-colors hover:text-kb-rose sm:text-sm"
            >
              Planos
            </Link>

            {session ? (
              <>
                <Link
                  to="/redeem"
                  className="hidden text-xs text-kb-gray transition-colors hover:text-kb-rose sm:inline sm:text-sm"
                >
                  Resgatar
                </Link>
                <Link
                  to="/dashboard"
                  className="text-xs text-kb-gray transition-colors hover:text-kb-rose sm:text-sm"
                >
                  Dashboard
                </Link>
                <button
                  type="button"
                  onClick={handleSignOut}
                  className="btn-ghost !px-3 !py-2 !text-xs sm:!px-6 sm:!py-3 sm:!text-sm"
                >
                  Sair
                </button>
              </>
            ) : (
              <Link
                to="/login"
                className="btn-ghost !px-3 !py-2 !text-xs sm:!px-6 sm:!py-3 sm:!text-sm"
              >
                Entrar
              </Link>
            )}
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
