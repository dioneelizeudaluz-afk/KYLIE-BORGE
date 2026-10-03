import { Link, useNavigate } from "react-router-dom";
import Container from "../components/ui/Container";
import Button from "../components/ui/Button";
import { AGE_GATE, STORAGE_KEYS } from "../lib/constants";

export default function AgeGate() {
  const navigate = useNavigate();

  function confirm() {
    try {
      window.localStorage.setItem(STORAGE_KEYS.ageGateConfirmed, "true");
    } catch {
      // localStorage indisponivel: prossegue apenas em memoria de sessao
    }
    navigate("/plans");
  }

  function deny() {
    try {
      window.localStorage.removeItem(STORAGE_KEYS.ageGateConfirmed);
    } catch {
      // ignora
    }
    navigate("/");
  }

  return (
    <section className="relative">
      <Container className="flex min-h-[70vh] flex-col items-center justify-center py-20">
        <div className="card-premium glass w-full max-w-lg p-8 text-center animate-fade-up">
          <span className="mb-4 inline-block rounded-full border border-kb-rose/40 px-4 py-1 text-[11px] uppercase tracking-[0.3em] text-kb-rose">
            +18
          </span>

          <h1 className="text-xl font-semibold text-kb-white sm:text-2xl">
            {AGE_GATE.title}
          </h1>

          <p className="mt-4 text-sm leading-relaxed text-kb-gray">
            {AGE_GATE.description}
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Button variant="primary" onClick={confirm}>
              {AGE_GATE.confirmLabel}
            </Button>
            <Button variant="ghost" onClick={deny}>
              {AGE_GATE.denyLabel}
            </Button>
          </div>

          <p className="mt-6 text-xs text-kb-graySoft">
            Esta confirmacao e uma barreira de experiencia, nao um mecanismo de seguranca.
          </p>

          <div className="mt-6">
            <Link to="/" className="link-rose text-xs">
              Voltar
            </Link>
          </div>
        </div>
      </Container>
    </section>
  );
}
