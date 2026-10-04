import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Container from "../components/ui/Container";
import { useAuth } from "../auth/useAuth";
import { listActivePlans, type Plan } from "../services/planService";

type State =
  | { status: "loading" }
  | { status: "error"; message: string }
  | { status: "ready"; plans: Plan[] };

function formatPrice(price: number, currency: string): string {
  try {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency
    }).format(price);
  } catch {
    return `${currency} ${price.toFixed(2)}`;
  }
}

function formatDuration(hours: number): string {
  if (hours <= 0) return "—";
  if (hours < 24) return `${hours}h`;
  const days = Math.round(hours / 24);
  return `${days} dias`;
}

export default function Plans() {
  const { session } = useAuth();
  const [state, setState] = useState<State>({ status: "loading" });

  useEffect(() => {
    let cancelled = false;

    listActivePlans()
      .then((plans) => {
        if (!cancelled) setState({ status: "ready", plans });
      })
      .catch((err: unknown) => {
        const message = err instanceof Error ? err.message : "Erro ao carregar planos";
        if (!cancelled) setState({ status: "error", message });
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <section className="relative">
      <Container className="py-16">
        <div className="mx-auto max-w-2xl text-center">
          <h1 className="font-display text-3xl tracking-[0.25em] text-kb-white sm:text-4xl">
            PLANOS
          </h1>
          <p className="mt-3 text-sm text-kb-gray">
            Escolhe o nivel de acesso que faz sentido para ti.
          </p>
        </div>

        {state.status === "loading" && (
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[0, 1, 2].map((i) => (
              <div key={i} className="card-premium glass flex flex-col gap-4 p-6 opacity-70">
                <div className="h-6 w-24 animate-pulse rounded-full bg-kb-line/60" />
                <div className="h-10 w-32 animate-pulse rounded-lg bg-kb-line/40" />
                <div className="h-4 w-full animate-pulse rounded bg-kb-line/30" />
                <div className="h-4 w-2/3 animate-pulse rounded bg-kb-line/30" />
                <div className="mt-4 h-10 w-full animate-pulse rounded-full bg-kb-line/40" />
              </div>
            ))}
          </div>
        )}

        {state.status === "error" && (
          <div className="card-premium glass mx-auto mt-12 max-w-lg p-6 text-center">
            <p className="text-sm text-kb-rose">Nao foi possivel carregar os planos.</p>
            <p className="mt-2 text-xs text-kb-graySoft">{state.message}</p>
          </div>
        )}

        {state.status === "ready" && state.plans.length === 0 && (
          <div className="card-premium glass mx-auto mt-12 max-w-lg p-6 text-center">
            <p className="text-sm text-kb-gray">Nenhum plano disponivel neste momento.</p>
          </div>
        )}

        {state.status === "ready" && state.plans.length > 0 && (
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {state.plans.map((plan) => {
              const isFree = Number(plan.price) <= 0;
              const hasCheckout = Boolean(plan.checkout_url);
              return (
                <div
                  key={plan.id}
                  className="card-premium glass flex flex-col gap-4 p-6 transition-transform duration-300 hover:-translate-y-1 hover:shadow-glow"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-display text-2xl tracking-[0.2em] text-kb-white">
                      {plan.name.toUpperCase()}
                    </span>
                    <span className="rounded-full border border-kb-rose/30 px-3 py-1 text-[10px] uppercase tracking-[0.25em] text-kb-roseSoft">
                      {formatDuration(plan.duration_hours)}
                    </span>
                  </div>

                  <div className="text-3xl font-semibold text-kb-rose">
                    {formatPrice(Number(plan.price), plan.currency)}
                  </div>

                  {plan.description && (
                    <p className="text-sm leading-relaxed text-kb-gray">{plan.description}</p>
                  )}

                  {isFree ? (
                    <button className="btn-ghost mt-auto" type="button" disabled>
                      Plano gratuito
                    </button>
                  ) : hasCheckout ? (
                    <a
                      href={plan.checkout_url ?? "#"}
                      target="_blank"
                      rel="noreferrer"
                      className="btn-primary mt-auto"
                    >
                      Escolher {plan.name}
                    </a>
                  ) : (
                    <button className="btn-ghost mt-auto" type="button" disabled>
                      Em breve
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {state.status === "ready" && state.plans.length > 0 && (
          <div className="mt-10 text-center text-sm text-kb-gray">
            Ja tens um codigo de acesso?{" "}
            {session ? (
              <Link to="/redeem" className="link-rose">
                Resgatar aqui
              </Link>
            ) : (
              <Link to="/login" state={{ from: "/redeem" }} className="link-rose">
                Entra e resgata aqui
              </Link>
            )}
          </div>
        )}

        <div className="mt-10 text-center">
          <Link to="/" className="link-rose text-sm">
            Voltar ao inicio
          </Link>
        </div>
      </Container>
    </section>
  );
}
