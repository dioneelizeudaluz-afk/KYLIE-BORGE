import { useState } from "react";
import { Link } from "react-router-dom";
import Container from "../components/ui/Container";
import { useAuth } from "../auth/useAuth";
import {
  formatCode,
  reserveCodeByPlan,
  RESERVE_ERROR_MESSAGES
} from "../services/checkoutService";

interface PlanOption {
  label: string;
  price: string;
  slug: string;
}

const plans: PlanOption[] = [
  { label: "Teste", price: "R$ 5,00", slug: "teste" },
  { label: "Pro", price: "R$ 19,90", slug: "pro" },
  { label: "Premium", price: "R$ 39,90", slug: "premium" }
];

export default function CheckoutReturn() {
  const { session } = useAuth();
  const [loadingSlug, setLoadingSlug] = useState<string | null>(null);
  const [code, setCode] = useState<string | null>(null);
  const [planName, setPlanName] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  async function handleChoose(slug: string) {
    setError(null);
    setCode(null);
    setPlanName(null);
    setCopied(false);
    setLoadingSlug(slug);
    try {
      const result = await reserveCodeByPlan(slug);
      if (result.ok && result.code && result.plan_name) {
        setCode(result.code);
        setPlanName(result.plan_name);
      } else {
        setError(RESERVE_ERROR_MESSAGES[result.error ?? "ERRO_INTERNO"] ?? RESERVE_ERROR_MESSAGES.ERRO_INTERNO);
      }
    } catch {
      setError(RESERVE_ERROR_MESSAGES.ERRO_INTERNO);
    } finally {
      setLoadingSlug(null);
    }
  }

  async function handleCopy() {
    if (!code) return;
    try {
      await navigator.clipboard.writeText(formatCode(code));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // ignora
    }
  }

  return (
    <section className="relative">
      <Container className="py-16">
        <div className="card-premium glass mx-auto max-w-xl p-6 text-center sm:p-8">
          <span className="mb-4 inline-block rounded-full border border-kb-rose/30 bg-kb-rose/5 px-4 py-1 text-[11px] uppercase tracking-[0.3em] text-kb-roseSoft">
            Checkout
          </span>

          <h1 className="font-display text-2xl tracking-[0.25em] text-kb-white sm:text-3xl">
            OBRIGADO
          </h1>

          {!session && (
            <>
              <p className="mt-4 text-sm leading-relaxed text-kb-gray">
                Para receberes o teu codigo de acesso, faz login ou regista-te com o
                mesmo email que usaste na EscalePay.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
                <Link to="/login" state={{ from: "/checkout-return" }} className="btn-primary">
                  Entrar
                </Link>
                <Link to="/register" className="btn-ghost">
                  Criar conta
                </Link>
              </div>
            </>
          )}

          {session && !code && (
            <>
              <p className="mt-4 text-sm leading-relaxed text-kb-gray">
                Escolhe o valor que pagaste na EscalePay para receberes o teu codigo.
              </p>
              <div className="mt-8 flex flex-col gap-3">
                {plans.map((p) => (
                  <button
                    key={p.slug}
                    type="button"
                    onClick={() => void handleChoose(p.slug)}
                    disabled={loadingSlug !== null}
                    className="flex items-center justify-between rounded-2xl border border-kb-line bg-kb-black/40 px-5 py-4 text-left transition-all hover:border-kb-rose/50 hover:bg-kb-rose/5 disabled:opacity-50"
                  >
                    <span>
                      <span className="block font-display text-lg tracking-[0.2em] text-kb-white">
                        {p.label.toUpperCase()}
                      </span>
                      <span className="block text-xs text-kb-graySoft">{p.slug}</span>
                    </span>
                    <span className="text-lg font-semibold text-kb-rose">
                      {loadingSlug === p.slug ? "..." : p.price}
                    </span>
                  </button>
                ))}
              </div>
              {error && (
                <p className="mt-6 rounded-lg border border-kb-rose/30 bg-kb-rose/5 px-3 py-2 text-xs text-kb-roseSoft">
                  {error}
                </p>
              )}
            </>
          )}

          {session && code && planName && (
            <>
              <p className="mt-4 text-sm leading-relaxed text-kb-gray">
                O teu codigo de acesso ao plano <strong className="text-kb-rose">{planName}</strong> e:
              </p>
              <div className="mt-6 rounded-2xl border border-kb-rose/40 bg-kb-rose/5 p-5">
                <p className="font-mono text-2xl tracking-[0.3em] text-kb-roseSoft">
                  {formatCode(code)}
                </p>
              </div>
              <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
                <button type="button" onClick={() => void handleCopy()} className="btn-primary">
                  {copied ? "Copiado!" : "Copiar codigo"}
                </button>
                <Link to="/redeem" className="btn-ghost">
                  Resgatar agora
                </Link>
              </div>
              <p className="mt-6 text-xs text-kb-graySoft">
                Guarda este codigo. Se perderes, contacta o suporte.
              </p>
            </>
          )}

          {session && (
            <p className="mt-6 text-[11px] uppercase tracking-[0.3em] text-kb-graySoft">
              Pagamento processado pela EscalePay
            </p>
          )}
        </div>
      </Container>
    </section>
  );
}
