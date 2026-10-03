import Container from "../../components/ui/Container";
import { useAuth } from "../../auth/useAuth";

export default function DashboardPlaceholder() {
  const { user, profile, signOut } = useAuth();

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
