import { useEffect, useState } from "react";
import { listAllPlans, updatePlan, type Plan } from "../../services/adminService";

function formatCurrency(value: number, currency: string): string {
  try {
    return new Intl.NumberFormat("pt-BR", { style: "currency", currency }).format(value);
  } catch {
    return `${currency} ${value.toFixed(2)}`;
  }
}

export default function AdminPlans() {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [editing, setEditing] = useState<Plan | null>(null);
  const [editPrice, setEditPrice] = useState<string>("");
  const [editDescription, setEditDescription] = useState<string>("");
  const [editCheckoutUrl, setEditCheckoutUrl] = useState<string>("");
  const [editActive, setEditActive] = useState<boolean>(true);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    setError(null);
    try {
      const p = await listAllPlans();
      setPlans(p);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void load();
  }, []);

  function startEdit(plan: Plan) {
    setEditing(plan);
    setEditPrice(String(plan.price));
    setEditDescription(plan.description ?? "");
    setEditCheckoutUrl(plan.checkout_url ?? "");
    setEditActive(plan.active);
    setSaveError(null);
  }

  async function handleSave() {
    if (!editing) return;
    setSaving(true);
    setSaveError(null);
    try {
      const priceNumber = Number(editPrice);
      if (!Number.isFinite(priceNumber) || priceNumber < 0) {
        setSaveError("Preco invalido");
        return;
      }
      await updatePlan(editing.id, {
        price: priceNumber,
        description: editDescription.trim() || null,
        checkout_url: editCheckoutUrl.trim() || null,
        active: editActive
      });
      setEditing(null);
      await load();
    } catch (err) {
      setSaveError(err instanceof Error ? err.message : "Erro ao guardar");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-display text-3xl tracking-[0.25em] text-kb-white">PLANOS</h1>
        <p className="mt-2 text-sm text-kb-gray">Edita precos, descricoes e links de checkout.</p>
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
                <th className="px-4 py-3">Slug</th>
                <th className="px-4 py-3">Preco</th>
                <th className="px-4 py-3">Duracao</th>
                <th className="px-4 py-3">Estado</th>
                <th className="px-4 py-3 text-right">Accoes</th>
              </tr>
            </thead>
            <tbody>
              {loading && (
                <tr>
                  <td colSpan={6} className="px-4 py-6 text-center text-kb-gray">
                    A carregar...
                  </td>
                </tr>
              )}
              {!loading &&
                plans.map((p) => (
                  <tr key={p.id} className="border-b border-kb-line/30 last:border-0">
                    <td className="px-4 py-3 text-kb-white">{p.name}</td>
                    <td className="px-4 py-3 font-mono text-xs text-kb-gray">{p.slug}</td>
                    <td className="px-4 py-3 text-kb-rose">
                      {formatCurrency(Number(p.price), p.currency)}
                    </td>
                    <td className="px-4 py-3 text-kb-gray">{p.duration_hours}h</td>
                    <td className="px-4 py-3">
                      <span
                        className={[
                          "rounded-full border px-2 py-0.5 text-[10px] uppercase tracking-[0.2em]",
                          p.active
                            ? "border-emerald-400/40 text-emerald-300"
                            : "border-kb-line text-kb-graySoft"
                        ].join(" ")}
                      >
                        {p.active ? "activo" : "inactivo"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button
                        type="button"
                        onClick={() => startEdit(p)}
                        className="text-xs text-kb-gray hover:text-kb-rose"
                      >
                        Editar
                      </button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>

      {editing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
          <div className="card-premium glass w-full max-w-md p-6">
            <h2 className="font-display text-2xl tracking-[0.2em] text-kb-white">
              EDITAR {editing.name.toUpperCase()}
            </h2>

            <div className="mt-6 flex flex-col gap-4">
              <label className="flex flex-col gap-2 text-xs text-kb-gray">
                Preco
                <input
                  type="text"
                  inputMode="decimal"
                  value={editPrice}
                  onChange={(e) => setEditPrice(e.target.value)}
                  className="rounded-xl border border-kb-line bg-kb-black/60 px-4 py-3 text-sm text-kb-white outline-none"
                />
              </label>

              <label className="flex flex-col gap-2 text-xs text-kb-gray">
                Descricao
                <textarea
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  rows={3}
                  className="rounded-xl border border-kb-line bg-kb-black/60 px-4 py-3 text-sm text-kb-white outline-none"
                />
              </label>

              <label className="flex flex-col gap-2 text-xs text-kb-gray">
                Checkout URL (EscalePay)
                <input
                  type="url"
                  value={editCheckoutUrl}
                  onChange={(e) => setEditCheckoutUrl(e.target.value)}
                  placeholder="https://checkout.escalepay.com/..."
                  className="rounded-xl border border-kb-line bg-kb-black/60 px-4 py-3 text-sm text-kb-white outline-none"
                />
              </label>

              <label className="flex items-center gap-3 text-xs text-kb-gray">
                <input
                  type="checkbox"
                  checked={editActive}
                  onChange={(e) => setEditActive(e.target.checked)}
                  className="h-4 w-4 accent-pink-500"
                />
                Activo
              </label>

              {saveError && (
                <p className="rounded-lg border border-kb-rose/30 bg-kb-rose/5 px-3 py-2 text-xs text-kb-roseSoft">
                  {saveError}
                </p>
              )}

              <div className="flex flex-col gap-2 sm:flex-row">
                <button
                  type="button"
                  onClick={() => void handleSave()}
                  disabled={saving}
                  className="btn-primary flex-1"
                >
                  {saving ? "A guardar..." : "Guardar"}
                </button>
                <button type="button" onClick={() => setEditing(null)} className="btn-ghost">
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
