import { Link, Outlet } from "react-router-dom";
import Container from "../components/ui/Container";
import Logo from "../components/Logo";

export default function AuthLayout() {
  return (
    <div className="relative min-h-screen bg-kb-black text-kb-white">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[600px] bg-kb-radial" />

      <Container className="relative flex min-h-screen flex-col items-center justify-center py-12">
        <Link to="/" className="mb-8 inline-flex flex-col items-center">
          <Logo variant="full" className="h-28 w-auto" />
        </Link>

        <div className="card-premium glass w-full max-w-md p-6 sm:p-8">
          <Outlet />
        </div>

        <Link to="/" className="mt-8 text-xs text-kb-graySoft hover:text-kb-rose transition-colors">
          Voltar ao inicio
        </Link>
      </Container>
    </div>
  );
}
