import { useEffect, useState } from "react";
import { listClients, type ClientWithPlan } from "../../services/adminService";

function formatDate(iso: string | null): string {
  if (!iso) return "—";
  try {
    return new Intl.DateTimeFormat("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric"
    }).format(new Date(iso));
  } catch {
    return iso;
  }
}

export default function AdminClients() {
  const [clients, setClients] = useState<ClientWithPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    listClients()
      .then((c) => {
        if (!cancelled) setClients(c);
      })
      .catch((err: unknown) => {
        if (!cancelled) setError(err instanceof Error ? err.message : "Erro");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-display text-3xl tracking-[0.25em] text-kb-white">CLIENTES</h1>
        <p className="mt-2 text-sm text-kb-gray">Utilizadores registados.</p>
      </div>

      {error && (
        <p className="rounded-lg border border-kb-rose/30 bg-kb-rose/5 px-3 py-2 text-xs text-kb-roseSoft">
          {error}
        </p>
      )}

      <div className="card-premium glass overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-kb-line/60 text-[10px] uppercase tracking-[0.25em] text-kb-graySoft">
              <tr>
                <th className="px-4 py-3">Nome</th>
                <th className="px-4 py-3">Role</th>
                <th className="px-4 py-3">Plano</th>
                <th className="px-4 py-3">Expira</th>
                <th className="px-4 py-3">Registado</th>
              </tr>
            </thead>
            <tbody>
              {loading && (
                <tr>
                  <td colSpan={5} className="px-4 py-6 text-center text-kb-gray">
                    A carregar...
                  </td>
                </tr>
              )}
              {!loading && clients.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-4 py-6 text-center text-kb-gray">
                    Sem clientes.
                  </td>
                </tr>
              )}
              {!loading &&
                clients.map((c) => (
                  <tr key={c.profile.id} className="border-b border-kb-line/30 last:border-0">
                    <td className="px-4 py-3 text-kb-white">{c.profile.display_name ?? "—"}</td>
                    <td className="px-4 py-3 text-kb-gray">{c.profile.role}</td>
                    <td className="px-4 py-3 text-kb-rose">{c.activePlan?.name ?? "—"}</td>
                    <td className="px-4 py-3 text-kb-graySoft">{formatDate(c.expiresAt)}</td>
                    <td className="px-4 py-3 text-kb-graySoft">
                      {formatDate(c.profile.created_at)}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
