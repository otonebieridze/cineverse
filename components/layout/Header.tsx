import Link from "next/link";

export default function Header() {
  return (
    <header className="border-b border-white/10 bg-background/80 backdrop-blur">
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center px-6">
        <Link href="/" className="text-lg font-semibold tracking-tight">
          Cine<span className="text-accent">Verse</span>
        </Link>
      </div>
    </header>
  );
}
