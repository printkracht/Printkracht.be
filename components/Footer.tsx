export default function Footer() {
  return (
    <footer
      style={{
        borderTop: '1px solid rgba(148, 163, 184, 0.15)',
        background: 'rgba(15, 23, 42, 0.65)',
        backdropFilter: 'blur(10px)',
      }}
    >
      <div
        style={{
          maxWidth: '1100px',
          margin: '0 auto',
          padding: '1rem 1.5rem 1.5rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1rem',
          color: '#94a3b8',
          fontSize: '0.95rem',
        }}
      >
        <span>Gemaakt voor grafische studio&apos;s, signmakers en reclamebureaus.</span>
        <span style={{ color: '#cbd5e1' }}>Je prijs in 30 seconden.</span>
      </div>
    </footer>
  );
}
