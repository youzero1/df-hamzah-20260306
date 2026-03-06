'use client';

interface DisplayProps {
  expression: string;
  result: string;
  mode: string;
}

export default function Display({ expression, result, mode }: DisplayProps) {
  const modeColors: Record<string, string> = {
    basic: '#e94560',
    tax: '#f5a623',
    discount: '#27ae60',
    margin: '#533483',
    markup: '#3498db',
  };

  const modeLabels: Record<string, string> = {
    basic: 'BASIC',
    tax: 'TAX CALC',
    discount: 'DISCOUNT',
    margin: 'MARGIN',
    markup: 'MARKUP',
  };

  return (
    <div
      style={{
        background: '#0a0a15',
        borderRadius: '12px',
        padding: '16px 20px',
        marginBottom: '16px',
        minHeight: '100px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        boxShadow: 'inset 0 2px 10px rgba(0,0,0,0.5)',
        border: '1px solid #1a1a3e',
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '8px',
        }}
      >
        <span
          style={{
            fontSize: '0.65rem',
            fontWeight: 700,
            color: modeColors[mode] || '#e94560',
            letterSpacing: '0.1em',
            background: `${modeColors[mode]}22`,
            padding: '2px 8px',
            borderRadius: '20px',
            border: `1px solid ${modeColors[mode]}44`,
          }}
        >
          {modeLabels[mode] || 'BASIC'}
        </span>
      </div>
      <div
        style={{
          fontSize: '0.85rem',
          color: '#666',
          textAlign: 'right',
          minHeight: '20px',
          wordBreak: 'break-all',
          fontFamily: 'monospace',
        }}
      >
        {expression || '\u00a0'}
      </div>
      <div
        style={{
          fontSize: expression.length > 20 ? '1.4rem' : '2rem',
          fontWeight: 600,
          textAlign: 'right',
          color: '#eaeaea',
          fontFamily: 'monospace',
          letterSpacing: '0.02em',
          marginTop: '4px',
          transition: 'font-size 0.1s',
        }}
      >
        {result || '0'}
      </div>
    </div>
  );
}
