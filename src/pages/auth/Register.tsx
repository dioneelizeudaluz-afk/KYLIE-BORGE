import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../auth/useAuth";

export default function Register() {
  const { signUp } = useAuth();
  const navigate = useNavigate();

  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setInfo(null);

    if (password.length < 6) {
      setError("A password deve ter pelo menos 6 caracteres.");
      return;
    }
    if (password !== confirm) {
      setError("As passwords nao coincidem.");
      return;
    }

    setSubmitting(true);
    try {
      await signUp(email.trim(), password, displayName.trim() || undefined);
      setInfo("Conta criada. Verifica o teu email para confirmar o registo.");
      setTimeout(() => navigate("/login", { replace: true }), 1500);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao criar conta");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div>
      <h1 className="font-display text-2xl tracking-[0.25em] text-kb-white">CRIAR CONTA</h1>
      <p className="mt-2 text-sm text-kb-gray">Regista-te para aceder ao conteudo.</p>

      <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
        <label className="flex flex-col gap-2 text-xs text-kb-gray">
          Nome
          <input
            type="text"
            autoComplete="name"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            className="rounded-xl border border-kb-line bg-kb-black/60 px-4 py-3 text-sm text-kb-white outline-none transition-colors focus:border-kb-rose"
          />
        </label>

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

        <label className="flex flex-col gap-2 text-xs text-kb-gray">
          Password
          <input
            type="password"
            required
            autoComplete="new-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="rounded-xl border border-kb-line bg-kb-black/60 px-4 py-3 text-sm text-kb-white outline-none transition-colors focus:border-kb-rose"
          />
        </label>

        <label className="flex flex-col gap-2 text-xs text-kb-gray">
          Confirmar password
          <input
            type="password"
            required
            autoComplete="new-password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
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
          {submitting ? "A criar..." : "Criar conta"}
        </button>
      </form>

      <p className="mt-6 text-xs text-kb-gray">
        Ja tens conta?{" "}
        <Link to="/login" className="link-rose">
          Entrar
        </Link>
      </p>
    </div>
  );
}
