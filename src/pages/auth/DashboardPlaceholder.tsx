import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Container from "../../components/ui/Container";
import { useAuth } from "../../auth/useAuth";
import {
  getMyActiveSubscription,
  type ActiveSubscription
} from "../../services/subscriptionService";

export default function DashboardPlaceholder() {
  const { user, profile, signOut } = useAuth();
  const [active, setActive] = useState<ActiveSubscription | null>(null);
  const [loadingActive, setLoadingActive] = useState(true);

  useEffect(() => {
    let cancelled = false;

    getMyActiveSubscription()
      .then((data) => {
        if (!cancelled) setActive(data);
      })
      .catch(() => {
        if (!cancelled) setActive(null);
      })
      .finally(() => {
        if (!cancelled) setLoadingActive(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <section className="relative">
      <Container className="py-16">
        <div className="card-premium glass p-6 sm:p-8">
          <h1 className="font-display text-3xl tracking-[0.25em] text-kb-white">DASHBOARD</h1>
          <p className="mt-4 text-sm text-kb-gray">
            Sessao activa. O dashboard completo sera construido na FASE 7.
          </p>

          <dl className="mt-6 grid gap-3 text-sm">
            <div className="flex justify-between border-b border-kb-line/60 pb-2">
              <dt className="text-kb-gray">Email</dt>
              <dd className="text-kb-white">{user?.email ?? "-"}</dd>
            </div>
            <div className="flex justify-between border-b border-kb-line/60 pb-2">
              <dt className="text-kb-gray">Nome</dt>
              <dd className="text-kb-white">{profile?.display_name ?? "-"}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-kb-gray">Role</dt>
              <dd className="text-kb-white">{profile?.role ?? "-"}</dd>
            </div>
          </dl>

          <div className="mt-8 border-t border-kb-line/60 pt-6">
            <h2 className="text-xs uppercase tracking-[0.3em] text-kb-graySoft">
              Subscricao
            </h2>

            {loadingActive && (
              <p className="mt-3 text-sm text-kb-gray">A carregar...</p>
            )}

            {!loadingActive && !active && (
              <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-sm text-kb-gray">Sem plano activo.</p>
                <Link to="/redeem" className="btn-primary w-fit">
                  Resgatar codigo
                </Link>
              </div>
            )}

            {!loadingActive && active && (
              <div className="mt-3 flex flex-col gap-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-kb-gray">Plano</span>
                  <span className="font-semibold text-kb-rose">{active.plan.name}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-kb-gray">Estado</span>
                  <span className="text-kb-white">Activo</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-kb-gray">Expira em</span>
                  <span className="text-kb-white">
                    {active.daysRemaining} {active.daysRemaining === 1 ? "dia" : "dias"}
                  </span>
                </div>
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={() => void signOut()}
            className="btn-ghost mt-8"
          >
            Sair
          </button>
        </div>
      </Container>
    </section>
  );
}
