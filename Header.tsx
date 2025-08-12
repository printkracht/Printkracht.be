import Link from "next/link";

export default function Header() {
  return (
    <header className="border-b border-white/10 sticky top-0 backdrop-blur z-50">
      <div className="container flex items-center gap-6 py-3">
        <Link href="/" className="text-white font-bold text-lg">WrapStudio</Link>
        <nav className="ml-auto flex items-center gap-4 text-gray-300">
          <Link href="/wrap-calculator" className="hover:text-white">Wrap berekenen</Link>
          <Link href="/tint-calculator" className="hover:text-white">Zonwerende folie (gebouw)</Link>
          <Link href="/design" className="hover:text-white">Ontwerp (CAR-SIGNER)</Link>
        </nav>
        <Link href="/wrap-calculator" className="btn btn-primary ml-4">Boek intake</Link>
      </div>
    </header>
  );
}
