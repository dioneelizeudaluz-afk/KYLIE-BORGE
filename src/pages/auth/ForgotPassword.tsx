import { useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../auth/useAuth";

export default function ForgotPassword() {
  const { resetPassword } = useAuth();
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setInfo(null);
    setSubmitting(true);
    try {
      await resetPassword(email.trim());
      setInfo("Se o email existir, receberas instrucoes para redefinir a password.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao enviar email");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div>
      <h1 className="font-display text-2xl tracking-[0.25em] text-kb-white">RECUPERAR</h1>
      <p className="mt-2 text-sm text-kb-gray">Recebe um link para redefinir a password.</p>

      <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
        <label className="flex flex-col gap-2 text-xs text-kb-gray">
          Email
          <input
            type="email"
            required
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="rounded-xl border border-kb-line bg-kb-black/60 px-4 py-3 text-sm text-kb-white outline-none transition-colors focus:border-kb-rose"
          />
        </label>

        {error && (
          <p className="rounded-lg border border-kb-rose/30 bg-kb-rose/5 px-3 py-2 text-xs text-kb-roseSoft">
            {error}
          </p>
        )}
        {info && (
          <p className="rounded-lg border border-kb-line bg-kb-card/60 px-3 py-2 text-xs text-kb-gray">
            {info}
          </p>
        )}

        <button type="submit" disabled={submitting} className="btn-primary mt-2">
          {submitting ? "A enviar..." : "Enviar link"}
        </button>
      </form>

      <p className="mt-6 text-xs text-kb-gray">
        <Link to="/login" className="link-rose">
          Voltar ao login
        </Link>
      </p>
    </div>
  );
}
