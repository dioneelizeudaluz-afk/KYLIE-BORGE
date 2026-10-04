import { useCallback, useEffect, useState } from "react";
import {
  createCodes,
  deleteAvailableCode,
  listAllCodes,
  listAllPlans,
  setCodeStatus,
  type CodeFilter,
  type CodeWithPlan,
  type Plan
} from "../../services/adminService";

function formatCode(raw: string): string {
  const parts: string[] = [];
  for (let i = 0; i < raw.length; i += 4) parts.push(raw.slice(i, i + 4));
  return parts.join("-");
}

function formatDate(iso: string | null): string {
  if (!iso) return "—";
  try {
    return new Intl.DateTimeFormat("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    }).format(new Date(iso));
  } catch {
    return iso;
  }
}

const filters: { value: CodeFilter; label: string }[] = [
  { value: "all", label: "Todas" },
  { value: "available", label: "Disponiveis" },
  { value: "used", label: "Usadas" },
  { value: "disabled", label: "Desactivadas" },
  { value: "expired", label: "Expiradas" }
];

export default function AdminCodes() {
  const [filter, setFilter] = useState<CodeFilter>("all");
  const [planFilter, setPlanFilter] = useState<string>("");
  const [codes, setCodes] = useState<CodeWithPlan[]>([]);
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [modalOpen, setModalOpen] = useState(false);
  const [modalPlanSlug, setModalPlanSlug] = useState<string>("");
  const [modalQuantity, setModalQuantity] = useState<number>(5);
  const [modalSubmitting, setModalSubmitting] = useState(false);
  const [modalError, setModalError] = useState<string | null>(null);
  const [generated, setGenerated] = useState<string[]>([]);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [c, p] = await Promise.all([
        listAllCodes(filter, planFilter || null),
        listAllPlans()
      ]);
      setCodes(c);
      setPlans(p);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao carregar");
    } finally {
      setLoading(false);
    }
  }, [filter, planFilter]);

  useEffect(() => {
    void load();
  }, [load]);

  async function handleCopy(code: string) {
    try {
      await navigator.clipboard.writeText(formatCode(code));
    } catch {
      // ignora
    }
  }

  async function handleToggleStatus(c: CodeWithPlan) {
    try {
      if (c.code.status === "available") {
        await setCodeStatus(c.code.id, "disabled");
      } else if (c.code.status === "disabled") {
        await setCodeStatus(c.code.id, "available");
      }
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao actualizar");
    }
  }

  async function handleDelete(c: CodeWithPlan) {
    if (c.code.status !== "available") return;
    try {
      await deleteAvailableCode(c.code.id);
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao apagar");
    }
  }

  async function handleGenerate() {
    setModalSubmitting(true);
    setModalError(null);
    setGenerated([]);
    try {
      const result = await createCodes(modalPlanSlug, modalQuantity);
      if (!result.ok) {
        setModalError(result.details ?? result.error ?? "Erro");
      } else {
        setGenerated(result.codes ?? []);
        await load();
      }
    } catch (err) {
      setModalError(err instanceof Error ? err.message : "Erro");
    } finally {
      setModalSubmitting(false);
    }
  }

  const planById = new Map(plans.map((p) => [p.id, p]));

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-3xl tracking-[0.25em] text-kb-white">CODIGOS</h1>
          <p className="mt-2 text-sm text-kb-gray">Gera e gere codigos de acesso.</p>
        </div>
        <button type="button" onClick={() => setModalOpen(true)} className="btn-primary">
          Gerar codigos
        </button>
      </div>

      <div className="flex flex-wrap gap-2">
        {filters.map((f) => (
          <button
            key={f.value}
            type="button"
            onClick={() => setFilter(f.value)}
            className={[
              "rounded-full border px-3 py-1.5 text-xs transition-colors",
              filter === f.value
                ? "border-kb-rose/50 bg-kb-rose/10 text-kb-roseSoft"
                : "border-kb-line text-kb-gray hover:border-kb-rose/40 hover:text-kb-rose"
            ].join(" ")}
          >
            {f.label}
          </button>
        ))}

        <select
          value={planFilter}
          onChange={(e) => setPlanFilter(e.target.value)}
          className="rounded-full border border-kb-line bg-kb-black/60 px-3 py-1.5 text-xs text-kb-white outline-none"
        >
          <option value="">Todos os planos</option>
          {plans.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
        </select>
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
                <th className="px-4 py-3">Codigo</th>
                <th className="px-4 py-3">Plano</th>
                <th className="px-4 py-3">Estado</th>
                <th className="px-4 py-3">Criado</th>
                <th className="px-4 py-3 text-right">Accoes</th>
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
              {!loading && codes.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-4 py-6 text-center text-kb-gray">
                    Sem codigos.
                  </td>
                </tr>
              )}
              {!loading &&
                codes.map((c) => (
                  <tr key={c.code.id} className="border-b border-kb-line/30 last:border-0">
                    <td className="px-4 py-3 font-mono text-kb-white">
                      {formatCode(c.code.code)}
                    </td>
                    <td className="px-4 py-3 text-kb-gray">
                      {planById.get(c.code.plan_id)?.name ?? c.plan?.name ?? "—"}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={[
                          "rounded-full border px-2 py-0.5 text-[10px] uppercase tracking-[0.2em]",
                          c.code.status === "available"
                            ? "border-emerald-400/40 text-emerald-300"
                            : c.code.status === "used"
                            ? "border-kb-rose/40 text-kb-roseSoft"
                            : "border-kb-line text-kb-graySoft"
                        ].join(" ")}
                      >
                        {c.code.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-kb-graySoft">{formatDate(c.code.created_at)}</td>
                    <td className="px-4 py-3">
                      <div className="flex justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => void handleCopy(c.code.code)}
                          className="text-xs text-kb-gray hover:text-kb-rose"
                        >
                          Copiar
                        </button>
                        {(c.code.status === "available" || c.code.status === "disabled") && (
                          <button
                            type="button"
                            onClick={() => void handleToggleStatus(c)}
                            className="text-xs text-kb-gray hover:text-kb-rose"
                          >
                            {c.code.status === "available" ? "Desactivar" : "Activar"}
                          </button>
                        )}
                        {c.code.status === "available" && (
                          <button
                            type="button"
                            onClick={() => void handleDelete(c)}
                            className="text-xs text-kb-gray hover:text-kb-rose"
                          >
                            Apagar
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
          <div className="card-premium glass w-full max-w-md p-6">
            <h2 className="font-display text-2xl tracking-[0.2em] text-kb-white">GERAR CODIGOS</h2>

            <div className="mt-6 flex flex-col gap-4">
              <label className="flex flex-col gap-2 text-xs text-kb-gray">
                Plano
                <select
                  value={modalPlanSlug}
                  onChange={(e) => setModalPlanSlug(e.target.value)}
                  className="rounded-xl border border-kb-line bg-kb-black/60 px-4 py-3 text-sm text-kb-white outline-none"
                >
                  <option value="">Escolher plano</option>
                  {plans
                    .filter((p) => p.active)
                    .map((p) => (
                      <option key={p.id} value={p.slug}>
                        {p.name}
                      </option>
                    ))}
                </select>
              </label>

              <label className="flex flex-col gap-2 text-xs text-kb-gray">
                Quantidade (1-200)
                <input
                  type="number"
                  min={1}
                  max={200}
                  value={modalQuantity}
                  onChange={(e) => setModalQuantity(Number(e.target.value))}
                  className="rounded-xl border border-kb-line bg-kb-black/60 px-4 py-3 text-sm text-kb-white outline-none"
                />
              </label>

              {modalError && (
                <p className="rounded-lg border border-kb-rose/30 bg-kb-rose/5 px-3 py-2 text-xs text-kb-roseSoft">
                  {modalError}
                </p>
              )}

              {generated.length > 0 && (
                <div className="rounded-xl border border-kb-line bg-kb-black/60 p-3">
                  <p className="text-[10px] uppercase tracking-[0.25em] text-kb-graySoft">
                    {generated.length} codigos gerados
                  </p>
                  <ul className="mt-2 flex flex-col gap-1 font-mono text-xs text-kb-white">
                    {generated.map((g) => (
                      <li key={g}>{g}</li>
                    ))}
                  </ul>
                  <button
                    type="button"
                    onClick={() => void navigator.clipboard.writeText(generated.join("\n"))}
                    className="btn-ghost mt-3 !px-3 !py-2 !text-xs"
                  >
                    Copiar todos
                  </button>
                </div>
              )}

              <div className="flex flex-col gap-2 sm:flex-row">
                <button
                  type="button"
                  onClick={() => void handleGenerate()}
                  disabled={!modalPlanSlug || modalSubmitting}
                  className="btn-primary flex-1"
                >
                  {modalSubmitting ? "A gerar..." : "Gerar"}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setModalOpen(false);
                    setModalError(null);
                    setGenerated([]);
                  }}
                  className="btn-ghost"
                >
                  Fechar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
