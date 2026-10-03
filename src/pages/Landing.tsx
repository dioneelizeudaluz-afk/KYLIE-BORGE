import { Link } from "react-router-dom";
import Container from "../components/ui/Container";
import Logo from "../components/Logo";
import { HERO } from "../lib/constants";

export default function Landing() {
  return (
    <section className="relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 bg-kb-fade" />

      <Container className="relative flex min-h-[80vh] flex-col items-center justify-center py-20 text-center">
        <span className="mb-4 inline-block rounded-full border border-kb-rose/30 bg-kb-rose/5 px-4 py-1 text-[11px] uppercase tracking-[0.3em] text-kb-roseSoft">
          {HERO.eyebrow}
        </span>

        <Logo variant="full" className="mb-8 h-40 w-auto animate-fade-in" />

        <p className="max-w-xl text-balance text-sm text-kb-gray sm:text-base">
          {HERO.subtitle}
        </p>

        <div className="mt-10 flex flex-col items-center gap-3 sm:flex-row">
          <Link to="/age-gate" className="btn-primary">
            {HERO.ctaLabel}
          </Link>
          <Link to="/plans" className="btn-ghost">
            Ver planos
          </Link>
        </div>

        <p className="mt-8 text-[11px] uppercase tracking-[0.3em] text-kb-graySoft">
          +18 · Conteudo privado
        </p>
      </Container>
    </section>
  );
}
