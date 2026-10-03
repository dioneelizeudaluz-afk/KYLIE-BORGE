import { Component, type ErrorInfo, type ReactNode } from "react";
import Container from "./ui/Container";

interface Props {
  children: ReactNode;
}

interface State {
  error: Error | null;
}

export default class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("[KYLIE BORGE] Erro de renderizacao:", error, info);
  }

  handleReload = () => {
    this.setState({ error: null });
    window.location.href = "/";
  };

  render() {
    if (!this.state.error) {
      return this.props.children;
    }

    return (
      <div className="relative min-h-screen bg-kb-black text-kb-white">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-[500px] bg-kb-radial" />
        <Container className="relative flex min-h-screen flex-col items-center justify-center py-20 text-center">
          <span className="mb-4 inline-block rounded-full border border-kb-rose/30 bg-kb-rose/5 px-4 py-1 text-[11px] uppercase tracking-[0.3em] text-kb-roseSoft">
            Erro
          </span>
          <h1 className="font-display text-3xl tracking-[0.25em] text-kb-white sm:text-4xl">
            ALGO FALHOU
          </h1>
          <p className="mt-4 max-w-lg text-sm text-kb-gray">
            Ocorreu um erro inesperado ao carregar a aplicacao.
          </p>
          <pre className="mt-6 max-w-lg overflow-auto rounded-2xl border border-kb-line bg-kb-card/60 p-4 text-left text-xs text-kb-graySoft">
            {this.state.error.message}
          </pre>
          <button type="button" onClick={this.handleReload} className="btn-primary mt-8">
            Voltar ao inicio
          </button>
        </Container>
      </div>
    );
  }
}
