export default function Footer() {
  return (
    <footer className="mt-16 border-t border-white/10">
      <div className="container py-10 text-gray-400 text-sm">
        <div className="grid-two">
          <div>
            <div className="text-white font-semibold mb-2">Printkracht</div>
            <p>Carwrapping & belettering met AI-versneld design. Sneller concept, strakke afwerking.</p>
          </div>
          <div className="text-right">
            <p>© {new Date().getFullYear()} Printkracht. Alle rechten voorbehouden.</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
