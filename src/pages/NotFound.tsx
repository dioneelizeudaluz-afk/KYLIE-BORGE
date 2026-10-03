import { Link } from "react-router-dom";
import Container from "../components/ui/Container";

export default function NotFound() {
  return (
    <section className="relative">
      <Container className="flex min-h-[60vh] flex-col items-center justify-center py-20 text-center">
        <span className="font-display text-7xl tracking-[0.2em] text-kb-rose">404</span>
        <p className="mt-4 text-sm text-kb-gray">A pagina que procuras nao existe.</p>
        <Link to="/" className="btn-ghost mt-8">
          Voltar ao inicio
        </Link>
      </Container>
    </section>
  );
}
