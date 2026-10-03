import { useState, type FormEvent } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../auth/useAuth";

interface LocationState {
  from?: string;
}

export default function Login() {
  const { signIn } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const state = (location.state as LocationState | null) ?? null;

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      await signIn(email.trim(), password);
      navigate(state?.from ?? "/dashboard", { replace: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao autenticar");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div>
      <h1 className="font-display text-2xl tracking-[0.25em] text-kb-white">ENTRAR</h1>
      <p className="mt-2 text-sm text-kb-gray">Acede a tua conta.</p>

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

        <label className="flex flex-col gap-2 text-xs text-kb-gray">
          Password
          <input
            type="password"
            required
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="rounded-xl border border-kb-line bg-kb-black/60 px-4 py-3 text-sm text-kb-white outline-none transition-colors focus:border-kb-rose"
          />
        </label>

        {error && (
          <p className="rounded-lg border border-kb-rose/30 bg-kb-rose/5 px-3 py-2 text-xs text-kb-roseSoft">
            {error}
          </p>
        )}

        <button type="submit" disabled={submitting} className="btn-primary mt-2">
          {submitting ? "A entrar..." : "Entrar"}
        </button>
      </form>

      <div className="mt-6 flex flex-col gap-2 text-xs text-kb-gray">
        <Link to="/forgot-password" className="link-rose">
          Esqueci-me da password
        </Link>
        <span>
          Ainda nao tens conta?{" "}
          <Link to="/register" className="link-rose">
            Criar conta
          </Link>
        </span>
      </div>
    </div>
  );
}
