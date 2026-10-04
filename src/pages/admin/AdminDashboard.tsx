import { useEffect, useState } from "react";
import {
  getStats,
  listClients,
  type AdminStats,
  type ClientWithPlan
} from "../../services/adminService";

interface StatCard {
  label: string;
  value: string;
  accent?: boolean;
}

function formatCurrency(value: number): string {
  try {
    return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(value);
  } catch {
    return `R$ ${value.toFixed(2)}`;
  }
}

function formatDate(iso: string): string {
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

export default function AdminDashboard() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [clients, setClients] = useState<ClientWithPlan[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    Promise.all([getStats(), listClients()])
      .then(([s, c]) => {
        if (cancelled) return;
        setStats(s);
        setClients(c.slice(0, 10));
      })
      .catch((err: unknown) => {
        if (cancelled) return;
        setError(err instanceof Error ? err.message : "Erro ao carregar");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const cards: StatCard[] = stats
    ? [
        { label: "Clientes", value: String(stats.totalClients) },
        { label: "Subscricoes activas", value: String(stats.activeSubscriptions), accent: true },
        { label: "Receita", value: formatCurrency(stats.totalRevenue), accent: true },
        { label: "Codigos disponiveis", value: String(stats.availableCodes) },
        { label: "Planos activos", value: String(stats.activePlans) },
        { label: "Pagamentos aprovados", value: String(stats.approvedPayments) }
      ]
    : [];

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="font-display text-3xl tracking-[0.25em] text-kb-white">DASHBOARD</h1>
        <p className="mt-2 text-sm text-kb-gray">Visao geral da plataforma.</p>
      </div>

      {loading && <p className="text-sm text-kb-gray">A carregar...</p>}

      {error && (
        <p className="rounded-lg border border-kb-rose/30 bg-kb-rose/5 px-3 py-2 text-xs text-kb-roseSoft">
          {error}
        </p>
      )}

      {stats && (
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-3">
          {cards.map((c) => (
            <div key={c.label} className="card-premium glass p-5">
              <p className="text-[10px] uppercase tracking-[0.3em] text-kb-graySoft">{c.label}</p>
              <p
                className={`mt-3 text-2xl font-semibold ${
                  c.accent ? "text-kb-rose" : "text-kb-white"
                }`}
              >
                {c.value}
              </p>
            </div>
          ))}
        </div>
      )}

      {clients.length > 0 && (
        <div>
          <h2 className="mb-4 font-display text-xl tracking-[0.2em] text-kb-white">
            ULTIMOS CLIENTES
          </h2>
          <div className="card-premium glass overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="border-b border-kb-line/60 text-[10px] uppercase tracking-[0.25em] text-kb-graySoft">
                  <tr>
                    <th className="px-4 py-3">Nome</th>
                    <th className="px-4 py-3">Role</th>
                    <th className="px-4 py-3">Plano</th>
                    <th className="px-4 py-3">Registado</th>
                  </tr>
                </thead>
                <tbody>
                  {clients.map((c) => (
                    <tr key={c.profile.id} className="border-b border-kb-line/30 last:border-0">
                      <td className="px-4 py-3 text-kb-white">
                        {c.profile.display_name ?? "—"}
                      </td>
                      <td className="px-4 py-3 text-kb-gray">{c.profile.role}</td>
                      <td className="px-4 py-3 text-kb-rose">
                        {c.activePlan?.name ?? "—"}
                      </td>
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
      )}
    </div>
  );
}
