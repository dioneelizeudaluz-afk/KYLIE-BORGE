import { Link } from "react-router-dom";
import Container from "../components/ui/Container";
import { useAuth } from "../auth/useAuth";

export default function CheckoutReturn() {
  const { session } = useAuth();

  return (
    <section className="relative">
      <Container className="py-16">
        <div className="card-premium glass mx-auto max-w-xl p-6 text-center sm:p-8">
          <span className="mb-4 inline-block rounded-full border border-kb-rose/30 bg-kb-rose/5 px-4 py-1 text-[11px] uppercase tracking-[0.3em] text-kb-roseSoft">
            Checkout
          </span>

          <h1 className="font-display text-2xl tracking-[0.25em] text-kb-white sm:text-3xl">
            OBRIGADO
          </h1>

          <p className="mt-4 text-sm leading-relaxed text-kb-gray">
            Se o teu pagamento foi aprovado, vais receber em breve um codigo de acesso
            no email ou WhatsApp indicados no checkout.
          </p>

          <p className="mt-4 text-sm leading-relaxed text-kb-gray">
            Assim que tiveres o codigo, resgata-o para activar o teu plano.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
            {session ? (
              <Link to="/redeem" className="btn-primary">
                Resgatar codigo
              </Link>
            ) : (
              <Link to="/login" state={{ from: "/redeem" }} className="btn-primary">
                Entrar e resgatar
              </Link>
            )}
            <Link to="/plans" className="btn-ghost">
              Voltar aos planos
            </Link>
          </div>

          <p className="mt-6 text-[11px] uppercase tracking-[0.3em] text-kb-graySoft">
            Pagamento processado pela EscalePay
          </p>
        </div>
      </Container>
    </section>
  );
}
