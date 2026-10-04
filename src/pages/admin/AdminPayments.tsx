import { useEffect, useState } from "react";
import { listPayments, type Payment } from "../../services/adminService";

function formatCurrency(value: number, currency: string): string {
  try {
    return new Intl.NumberFormat("pt-BR", { style: "currency", currency }).format(value);
  } catch {
    return `${currency} ${value.toFixed(2)}`;
  }
}

function formatDate(iso: string): string {
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

export default function AdminPayments() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    listPayments()
      .then((p) => {
        if (!cancelled) setPayments(p);
      })
      .catch(() => {
        if (!cancelled) setPayments([]);
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
        <h1 className="font-display text-3xl tracking-[0.25em] text-kb-white">PAGAMENTOS</h1>
        <p className="mt-2 text-sm text-kb-gray">
          Integracao EscalePay via webhook na FASE 10. Ate la, os pagamentos podem ficar
          vazios.
        </p>
      </div>

      <div className="card-premium glass overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-kb-line/60 text-[10px] uppercase tracking-[0.25em] text-kb-graySoft">
              <tr>
                <th className="px-4 py-3">Data</th>
                <th className="px-4 py-3">Valor</th>
                <th className="px-4 py-3">Estado</th>
                <th className="px-4 py-3">Ref. externa</th>
              </tr>
            </thead>
            <tbody>
              {loading && (
                <tr>
                  <td colSpan={4} className="px-4 py-6 text-center text-kb-gray">
                    A carregar...
                  </td>
                </tr>
              )}
              {!loading && payments.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-4 py-6 text-center text-kb-gray">
                    Sem pagamentos registados.
                  </td>
                </tr>
              )}
              {!loading &&
                payments.map((p) => (
                  <tr key={p.id} className="border-b border-kb-line/30 last:border-0">
                    <td className="px-4 py-3 text-kb-graySoft">{formatDate(p.created_at)}</td>
                    <td className="px-4 py-3 text-kb-white">
                      {formatCurrency(Number(p.amount), p.currency)}
                    </td>
                    <td className="px-4 py-3 text-kb-gray">{p.status}</td>
                    <td className="px-4 py-3 text-kb-graySoft">
                      {p.external_payment_id ?? "—"}
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
