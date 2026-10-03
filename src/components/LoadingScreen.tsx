import Container from "./ui/Container";

interface LoadingScreenProps {
  label?: string;
}

export default function LoadingScreen({ label = "A carregar..." }: LoadingScreenProps) {
  return (
    <div className="relative min-h-screen bg-kb-black text-kb-white">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[500px] bg-kb-radial" />
      <Container className="relative flex min-h-screen flex-col items-center justify-center py-20 text-center">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-kb-rose/30 border-t-kb-rose" />
        <p className="mt-6 text-sm text-kb-gray">{label}</p>
      </Container>
    </div>
  );
}
