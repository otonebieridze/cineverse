export default function Footer() {
  return (
    <footer className="border-t border-white/10">
      <div className="mx-auto w-full max-w-6xl px-6 py-6 text-sm text-muted-foreground">
        &copy; {new Date().getFullYear()} CineVerse. Built with Next.js.
      </div>
    </footer>
  );
}
