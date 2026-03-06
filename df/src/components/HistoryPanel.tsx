'use client';
import { CalculationRecord } from '../types';

interface HistoryPanelProps {
  history: CalculationRecord[];
  onClear: () => void;
  onClose: () => void;
  onSelect: (record: CalculationRecord) => void;
}

const typeColors: Record<string, string> = {
  basic: '#e94560',
  tax: '#f5a623',
  discount: '#27ae60',
  margin: '#533483',
  markup: '#3498db',
};

export default function HistoryPanel({ history, onClear, onClose, onSelect }: HistoryPanelProps) {
  return (
    <div
      style={{
        background: '#12122a',
        border: '1px solid #2a2a4e',
        borderRadius: '12px',
        padding: '16px',
        width: '280px',
        maxHeight: '600px',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: '0 4px 20px rgba(0,0,0,0.4)',
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '12px',
        }}
      >
        <h3 style={{ color: '#eaeaea', fontSize: '0.9rem', fontWeight: 700 }}>📋 History</h3>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            onClick={onClear}
            style={{
              background: '#2a1a1a',
              color: '#e74c3c',
              border: '1px solid #4a2a2a',
              borderRadius: '6px',
              padding: '4px 10px',
              fontSize: '0.75rem',
              cursor: 'pointer',
            }}
          >
            Clear
          </button>
          <button
            onClick={onClose}
            style={{
              background: '#1a1a2e',
              color: '#888',
              border: '1px solid #2a2a4e',
              borderRadius: '6px',
              padding: '4px 10px',
              fontSize: '0.75rem',
              cursor: 'pointer',
            }}
          >
            ✕
          </button>
        </div>
      </div>
      <div
        style={{
          overflowY: 'auto',
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
        }}
      >
        {history.length === 0 ? (
          <p style={{ color: '#555', fontSize: '0.8rem', textAlign: 'center', marginTop: '20px' }}>
            No calculations yet
          </p>
        ) : (
          history.map((record) => (
            <div
              key={record.id}
              onClick={() => onSelect(record)}
              style={{
                background: '#1a1a2e',
                borderRadius: '8px',
                padding: '10px 12px',
                cursor: 'pointer',
                border: `1px solid ${typeColors[record.type] || '#e94560'}33`,
                transition: 'all 0.15s',
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLDivElement).style.background = '#22223e';
                (e.currentTarget as HTMLDivElement).style.borderColor = `${typeColors[record.type] || '#e94560'}88`;
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLDivElement).style.background = '#1a1a2e';
                (e.currentTarget as HTMLDivElement).style.borderColor = `${typeColors[record.type] || '#e94560'}33`;
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                <span
                  style={{
                    fontSize: '0.6rem',
                    color: typeColors[record.type] || '#e94560',
                    fontWeight: 700,
                    letterSpacing: '0.05em',
                    textTransform: 'uppercase',
                  }}
                >
                  {record.type}
                </span>
                <span style={{ fontSize: '0.6rem', color: '#555' }}>
                  {new Date(record.createdAt).toLocaleTimeString()}
                </span>
              </div>
              <div style={{ fontSize: '0.75rem', color: '#888', marginBottom: '2px', fontFamily: 'monospace' }}>
                {record.expression}
              </div>
              <div style={{ fontSize: '0.9rem', color: '#eaeaea', fontWeight: 600, fontFamily: 'monospace' }}>
                = {record.result}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
