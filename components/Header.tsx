import Link from 'next/link';

export default function Header() {
  return (
    <header
      style={{
        borderBottom: '1px solid rgba(148, 163, 184, 0.15)',
        background: 'rgba(15, 23, 42, 0.7)',
        backdropFilter: 'blur(10px)',
      }}
    >
      <div
        style={{
          maxWidth: '1100px',
          margin: '0 auto',
          padding: '1rem 1.5rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1rem',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <div
            style={{
              width: 40,
              height: 40,
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #38bdf8, #0ea5e9)',
              display: 'grid',
              placeItems: 'center',
              fontWeight: 800,
              color: '#0b1120',
              boxShadow: '0 10px 25px rgba(14, 165, 233, 0.35)',
            }}
          >
            PK
          </div>
          <div>
            <div style={{ fontWeight: 800, fontSize: '1.1rem', color: '#e5e7eb' }}>
              Printkracht
            </div>
            <div style={{ color: '#94a3b8', fontSize: '0.95rem' }}>Wrap & belettering calculatie</div>
          </div>
        </div>
        <nav style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', color: '#cbd5e1' }}>
          <Link href="#calculator" style={{ textDecoration: 'none', color: 'inherit' }}>
            Calculator
          </Link>
          <span style={{ opacity: 0.5 }}>·</span>
          <Link href="#uitleg" style={{ textDecoration: 'none', color: 'inherit' }}>
            Uitleg
          </Link>
        </nav>
      </div>
    </header>
  );
}
