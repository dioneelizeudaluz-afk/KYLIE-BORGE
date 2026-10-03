import { Link } from "react-router-dom";
import Container from "../components/ui/Container";

export default function Plans() {
  return (
    <section className="relative">
      <Container className="py-16">
        <div className="mx-auto max-w-2xl text-center">
          <h1 className="font-display text-3xl tracking-[0.25em] text-kb-white sm:text-4xl">
            PLANOS
          </h1>
          <p className="mt-3 text-sm text-kb-gray">
            Os planos serao carregados da base de dados na proxima fase. Nenhum preco esta definido aqui.
          </p>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="card-premium glass flex flex-col gap-4 p-6 opacity-70"
            >
              <div className="h-6 w-24 rounded-full bg-kb-line/60" />
              <div className="h-10 w-32 rounded-lg bg-kb-line/40" />
              <div className="h-4 w-full rounded bg-kb-line/30" />
              <div className="h-4 w-2/3 rounded bg-kb-line/30" />
              <div className="mt-4 h-10 w-full rounded-full bg-kb-line/40" />
            </div>
          ))}
        </div>

        <div className="mt-10 text-center">
          <Link to="/" className="link-rose text-sm">
            Voltar ao inicio
          </Link>
        </div>
      </Container>
    </section>
  );
}
