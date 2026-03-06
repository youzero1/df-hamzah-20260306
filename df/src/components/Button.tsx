'use client';

interface ButtonProps {
  label: string;
  onClick: () => void;
  variant?: 'number' | 'operator' | 'special' | 'equals' | 'clear' | 'ecommerce';
  wide?: boolean;
  disabled?: boolean;
}

const variantStyles: Record<string, React.CSSProperties> = {
  number: {
    background: '#1a1a2e',
    color: '#eaeaea',
    border: '1px solid #2a2a4e',
  },
  operator: {
    background: '#0f3460',
    color: '#e94560',
    border: '1px solid #1a4a7a',
    fontWeight: 700,
  },
  special: {
    background: '#1a2a1e',
    color: '#27ae60',
    border: '1px solid #2a4a2e',
    fontWeight: 600,
  },
  equals: {
    background: 'linear-gradient(135deg, #e94560, #c0392b)',
    color: '#fff',
    border: 'none',
    fontWeight: 700,
    boxShadow: '0 2px 10px rgba(233,69,96,0.4)',
  },
  clear: {
    background: '#2a1a1a',
    color: '#e74c3c',
    border: '1px solid #4a2a2a',
    fontWeight: 600,
  },
  ecommerce: {
    background: 'linear-gradient(135deg, #533483, #3d2570)',
    color: '#fff',
    border: 'none',
    fontWeight: 600,
    fontSize: '0.7rem',
    boxShadow: '0 2px 8px rgba(83,52,131,0.4)',
  },
};

export default function Button({ label, onClick, variant = 'number', wide = false, disabled = false }: ButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        ...variantStyles[variant],
        borderRadius: '10px',
        padding: '0 8px',
        fontSize: variant === 'ecommerce' ? '0.7rem' : '1rem',
        height: '54px',
        width: wide ? '100%' : '100%',
        gridColumn: wide ? 'span 2' : 'span 1',
        transition: 'all 0.15s ease',
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.5 : 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        letterSpacing: '0.02em',
      }}
      onMouseEnter={(e) => {
        if (!disabled) {
          (e.currentTarget as HTMLButtonElement).style.filter = 'brightness(1.3)';
          (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(-1px)';
        }
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLButtonElement).style.filter = 'brightness(1)';
        (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(0)';
      }}
      onMouseDown={(e) => {
        (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(1px)';
      }}
      onMouseUp={(e) => {
        (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(-1px)';
      }}
    >
      {label}
    </button>
  );
}
