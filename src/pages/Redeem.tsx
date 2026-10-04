import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import Container from "../components/ui/Container";
import { useAuth } from "../auth/useAuth";
import {
  formatCodeForDisplay,
  redeemCode,
  REDEEM_ERROR_MESSAGES
} from "../services/accessCodeService";

export default function Redeem() {
  const { session, refreshProfile } = useAuth();
  const navigate = useNavigate();

  const [code, setCode] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  function handleChange(value: string) {
    setCode(formatCodeForDisplay(value));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    const clean = code.replace(/[^A-Za-z0-9]/g, "");
    if (clean.length !== 12) {
      setError("O codigo tem 12 caracteres. Verifica e tenta novamente.");
      return;
    }

    setSubmitting(true);
    try {
      const result = await redeemCode(code);
      if (result.ok) {
        setSuccess(`Codigo resgatado. Plano ${result.plan_name} activo.`);
        await refreshProfile();
        setTimeout(() => navigate("/dashboard", { replace: true }), 1500);
      } else {
        setError(REDEEM_ERROR_MESSAGES[result.error] ?? REDEEM_ERROR_MESSAGES.ERRO_INTERNO);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao resgatar codigo");
    } finally {
      setSubmitting(false);
    }
  }

  if (!session) {
    return (
      <section className="relative">
        <Container className="py-16">
          <div className="card-premium glass mx-auto max-w-lg p-6 text-center sm:p-8">
            <h1 className="font-display text-2xl tracking-[0.25em] text-kb-white">
              RESGATAR CODIGO
            </h1>
            <p className="mt-4 text-sm text-kb-gray">
              Precisas de estar autenticado para resgatar um codigo.
            </p>
            <Link to="/login" state={{ from: "/redeem" }} className="btn-primary mt-6">
              Entrar
            </Link>
          </div>
        </Container>
      </section>
    );
  }

  return (
    <section className="relative">
      <Container className="py-16">
        <div className="card-premium glass mx-auto max-w-lg p-6 sm:p-8">
          <h1 className="font-display text-2xl tracking-[0.25em] text-kb-white">
            RESGATAR CODIGO
          </h1>
          <p className="mt-2 text-sm text-kb-gray">
            Introduz o teu codigo de acesso para activar um plano.
          </p>

          <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
            <label className="flex flex-col gap-2 text-xs text-kb-gray">
              Codigo de acesso
              <input
                type="text"
                inputMode="text"
                autoComplete="off"
                autoCapitalize="characters"
                spellCheck={false}
                value={code}
                onChange={(e) => handleChange(e.target.value)}
                placeholder="XXXX-XXXX-XXXX"
                maxLength={14}
                className="rounded-xl border border-kb-line bg-kb-black/60 px-4 py-3 text-center text-base tracking-[0.3em] text-kb-white outline-none transition-colors focus:border-kb-rose"
              />
            </label>

            {error && (
              <p className="rounded-lg border border-kb-rose/30 bg-kb-rose/5 px-3 py-2 text-xs text-kb-roseSoft">
                {error}
              </p>
            )}
            {success && (
              <p className="rounded-lg border border-kb-line bg-kb-card/60 px-3 py-2 text-xs text-kb-gray">
                {success}
              </p>
            )}

            <button type="submit" disabled={submitting} className="btn-primary mt-2">
              {submitting ? "A resgatar..." : "Resgatar"}
            </button>
          </form>

          <p className="mt-6 text-xs text-kb-gray">
            <Link to="/plans" className="link-rose">
              Ainda nao tens codigo? Ver planos
            </Link>
          </p>
        </div>
      </Container>
    </section>
  );
}
