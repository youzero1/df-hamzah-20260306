'use client';
import Calculator from '../components/Calculator';

export default function Home() {
  return (
    <main
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #0f0f1a 0%, #1a1a2e 50%, #16213e 100%)',
        padding: '20px',
      }}
    >
      <div style={{ marginBottom: '20px', textAlign: 'center' }}>
        <h1
          style={{
            fontSize: '2rem',
            fontWeight: 700,
            background: 'linear-gradient(90deg, #e94560, #f5a623)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            letterSpacing: '0.05em',
          }}
        >
          💰 Pricing Calculator
        </h1>
        <p style={{ color: '#888', fontSize: '0.9rem', marginTop: '4px' }}>
          E-commerce Discount & Margin Tool
        </p>
      </div>
      <Calculator />
    </main>
  );
}
