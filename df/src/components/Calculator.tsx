'use client';
import { useState, useEffect, useCallback } from 'react';
import Display from './Display';
import Button from './Button';
import HistoryPanel from './HistoryPanel';
import { CalculationRecord, CalculationType } from '../types';

type Mode = 'basic' | 'tax' | 'discount' | 'margin' | 'markup';

export default function Calculator() {
  const [expression, setExpression] = useState('');
  const [result, setResult] = useState('0');
  const [mode, setMode] = useState<Mode>('basic');
  const [history, setHistory] = useState<CalculationRecord[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [ecomInput1, setEcomInput1] = useState('');
  const [ecomInput2, setEcomInput2] = useState('');
  const [ecomStep, setEcomStep] = useState<1 | 2>(1);

  const fetchHistory = useCallback(async () => {
    try {
      const res = await fetch('/api/calculations');
      if (res.ok) {
        const data = await res.json();
        setHistory(data);
      }
    } catch (e) {
      console.error('Failed to fetch history', e);
    }
  }, []);

  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  const saveCalculation = async (expr: string, res: string, type: CalculationType) => {
    try {
      await fetch('/api/calculations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ expression: expr, result: res, type }),
      });
      await fetchHistory();
    } catch (e) {
      console.error('Failed to save', e);
    }
  };

  const clearHistory = async () => {
    try {
      await fetch('/api/calculations', { method: 'DELETE' });
      setHistory([]);
    } catch (e) {
      console.error('Failed to clear history', e);
    }
  };

  const handleNumber = (num: string) => {
    if (mode !== 'basic') {
      if (ecomStep === 1) {
        setEcomInput1((prev) => (prev === '0' ? num : prev + num));
        setExpression((ecomInput1 === '0' ? num : ecomInput1 + num));
      } else {
        setEcomInput2((prev) => (prev === '0' ? num : prev + num));
      }
      return;
    }
    setResult((prev) => {
      if (prev === '0' || prev === 'Error') return num;
      return prev;
    });
    setExpression((prev) => {
      if (prev === 'Error') return num;
      return prev + num;
    });
  };

  const handleOperator = (op: string) => {
    if (mode !== 'basic') return;
    setExpression((prev) => {
      if (!prev) return '';
      const last = prev[prev.length - 1];
      if (['+', '-', '*', '/'].includes(last)) {
        return prev.slice(0, -1) + op;
      }
      return prev + op;
    });
    setResult('0');
  };

  const handleDecimal = () => {
    if (mode !== 'basic') {
      const target = ecomStep === 1 ? ecomInput1 : ecomInput2;
      if (target.includes('.')) return;
      if (ecomStep === 1) setEcomInput1(target + '.');
      else setEcomInput2(target + '.');
      return;
    }
    const parts = expression.split(/[+\-*/]/);
    const last = parts[parts.length - 1];
    if (last.includes('.')) return;
    setExpression((prev) => prev + '.');
  };

  const handleEquals = () => {
    if (mode === 'basic') {
      try {
        // eslint-disable-next-line no-eval
        const evalResult = Function('"use strict"; return (' + expression + ')')();
        const formatted = parseFloat(evalResult.toFixed(10)).toString();
        setResult(formatted);
        saveCalculation(expression, formatted, 'basic');
        setExpression('');
      } catch {
        setResult('Error');
        setExpression('');
      }
    }
  };

  const handleClear = () => {
    setExpression('');
    setResult('0');
    setEcomInput1('');
    setEcomInput2('');
    setEcomStep(1);
  };

  const handleBackspace = () => {
    if (mode !== 'basic') {
      if (ecomStep === 1) setEcomInput1((prev) => prev.slice(0, -1));
      else setEcomInput2((prev) => prev.slice(0, -1));
      return;
    }
    setExpression((prev) => prev.slice(0, -1));
  };

  const handleModeChange = (newMode: Mode) => {
    setMode(newMode);
    setExpression('');
    setResult('0');
    setEcomInput1('');
    setEcomInput2('');
    setEcomStep(1);
  };

  const handleEcomNext = () => {
    setEcomStep(2);
    setExpression(ecomInput1 + (mode === 'tax' ? ' | Tax Rate:' : mode === 'discount' ? ' | Discount %:' : mode === 'margin' ? ' | Cost:' : ' | Markup %:'));
  };

  const handleEcomCalculate = () => {
    const v1 = parseFloat(ecomInput1);
    const v2 = parseFloat(ecomInput2);
    if (isNaN(v1) || isNaN(v2)) {
      setResult('Error');
      return;
    }

    let calcResult = 0;
    let expr = '';
    let calcType: CalculationType = 'basic';

    if (mode === 'tax') {
      const taxAmount = v1 * v2;
      calcResult = v1 + taxAmount;
      expr = `Price $${v1} + Tax ${v2 * 100}% = $${calcResult.toFixed(2)}`;
      calcType = 'tax';
    } else if (mode === 'discount') {
      const discountAmt = v1 * (v2 / 100);
      calcResult = v1 - discountAmt;
      expr = `$${v1} - ${v2}% off = $${calcResult.toFixed(2)}`;
      calcType = 'discount';
    } else if (mode === 'margin') {
      // margin: given selling price and cost, calc margin %
      const margin = ((v1 - v2) / v1) * 100;
      calcResult = margin;
      expr = `Margin: ($${v1} - $${v2}) / $${v1} = ${margin.toFixed(2)}%`;
      calcType = 'margin';
    } else if (mode === 'markup') {
      // markup: given cost and markup %, calc selling price
      calcResult = v1 * (1 + v2 / 100);
      expr = `$${v1} + ${v2}% markup = $${calcResult.toFixed(2)}`;
      calcType = 'markup';
    }

    const formatted = parseFloat(calcResult.toFixed(10)).toString();
    setResult(formatted);
    setExpression(expr);
    saveCalculation(expr, formatted, calcType);
    setEcomStep(1);
    setEcomInput1('');
    setEcomInput2('');
  };

  const modeButtons: { label: string; mode: Mode; color: string }[] = [
    { label: 'Basic', mode: 'basic', color: '#e94560' },
    { label: 'Tax', mode: 'tax', color: '#f5a623' },
    { label: 'Discount', mode: 'discount', color: '#27ae60' },
    { label: 'Margin', mode: 'margin', color: '#533483' },
    { label: 'Markup', mode: 'markup', color: '#3498db' },
  ];

  const renderEcomDisplay = () => {
    const label1 = mode === 'tax' ? 'Price ($)' : mode === 'discount' ? 'Original Price ($)' : mode === 'margin' ? 'Selling Price ($)' : 'Cost ($)';
    const label2 = mode === 'tax' ? 'Tax Rate (decimal, e.g. 0.08)' : mode === 'discount' ? 'Discount (%)' : mode === 'margin' ? 'Cost ($)' : 'Markup (%)';

    return (
      <div style={{ marginBottom: '12px' }}>
        <div style={{
          background: '#0a0a15',
          borderRadius: '8px',
          padding: '10px 14px',
          marginBottom: '8px',
          border: '1px solid #1a1a3e',
        }}>
          <div style={{ fontSize: '0.7rem', color: '#888', marginBottom: '4px' }}>
            {ecomStep === 1 ? label1 : label2}
          </div>
          <div style={{ fontSize: '1.4rem', color: '#eaeaea', fontFamily: 'monospace', minHeight: '32px' }}>
            {ecomStep === 1 ? (ecomInput1 || '0') : (ecomInput2 || '0')}
          </div>
        </div>
        {result !== '0' && (
          <div style={{
            background: '#0a1a0a',
            borderRadius: '8px',
            padding: '8px 14px',
            border: '1px solid #27ae6044',
          }}>
            <div style={{ fontSize: '0.65rem', color: '#27ae60', marginBottom: '2px' }}>RESULT</div>
            <div style={{ fontSize: '1.2rem', color: '#eaeaea', fontFamily: 'monospace' }}>{result}</div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
      <div
        style={{
          background: '#12122a',
          borderRadius: '16px',
          padding: '20px',
          width: '340px',
          boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
          border: '1px solid #2a2a4e',
        }}
      >
        {/* Mode selector */}
        <div style={{ display: 'flex', gap: '6px', marginBottom: '16px', flexWrap: 'wrap' }}>
          {modeButtons.map((mb) => (
            <button
              key={mb.mode}
              onClick={() => handleModeChange(mb.mode)}
              style={{
                background: mode === mb.mode ? mb.color : '#1a1a2e',
                color: mode === mb.mode ? '#fff' : '#888',
                border: `1px solid ${mode === mb.mode ? mb.color : '#2a2a4e'}`,
                borderRadius: '20px',
                padding: '4px 12px',
                fontSize: '0.72rem',
                fontWeight: mode === mb.mode ? 700 : 400,
                cursor: 'pointer',
                transition: 'all 0.15s',
                boxShadow: mode === mb.mode ? `0 2px 8px ${mb.color}55` : 'none',
              }}
            >
              {mb.label}
            </button>
          ))}
        </div>

        {/* Display */}
        {mode === 'basic' ? (
          <Display expression={expression} result={result} mode={mode} />
        ) : (
          renderEcomDisplay()
        )}

        {/* Number grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '8px',
          }}
        >
          {/* Row 1 */}
          <Button label="C" onClick={handleClear} variant="clear" />
          <Button label="⌫" onClick={handleBackspace} variant="special" />
          <Button label="%" onClick={() => mode === 'basic' && handleOperator('%')} variant="special" />
          <Button label="÷" onClick={() => handleOperator('/')} variant="operator" />

          {/* Row 2 */}
          <Button label="7" onClick={() => handleNumber('7')} variant="number" />
          <Button label="8" onClick={() => handleNumber('8')} variant="number" />
          <Button label="9" onClick={() => handleNumber('9')} variant="number" />
          <Button label="×" onClick={() => handleOperator('*')} variant="operator" />

          {/* Row 3 */}
          <Button label="4" onClick={() => handleNumber('4')} variant="number" />
          <Button label="5" onClick={() => handleNumber('5')} variant="number" />
          <Button label="6" onClick={() => handleNumber('6')} variant="number" />
          <Button label="−" onClick={() => handleOperator('-')} variant="operator" />

          {/* Row 4 */}
          <Button label="1" onClick={() => handleNumber('1')} variant="number" />
          <Button label="2" onClick={() => handleNumber('2')} variant="number" />
          <Button label="3" onClick={() => handleNumber('3')} variant="number" />
          <Button label="+" onClick={() => handleOperator('+')} variant="operator" />

          {/* Row 5 */}
          <Button label="0" onClick={() => handleNumber('0')} variant="number" />
          <Button label="." onClick={handleDecimal} variant="number" />

          {mode === 'basic' ? (
            <Button label="=" onClick={handleEquals} variant="equals" wide />
          ) : ecomStep === 1 ? (
            <Button label="Next →" onClick={handleEcomNext} variant="equals" wide />
          ) : (
            <Button label="Calc" onClick={handleEcomCalculate} variant="equals" wide />
          )}
        </div>

        {/* E-commerce hint */}
        {mode !== 'basic' && (
          <div
            style={{
              marginTop: '12px',
              padding: '8px 12px',
              background: '#0f0f1a',
              borderRadius: '8px',
              fontSize: '0.7rem',
              color: '#666',
              lineHeight: 1.5,
            }}
          >
            {mode === 'tax' && '① Enter price → Next → ② Enter tax rate (e.g. 0.08 for 8%) → Calc'}
            {mode === 'discount' && '① Enter original price → Next → ② Enter discount % (e.g. 20) → Calc'}
            {mode === 'margin' && '① Enter selling price → Next → ② Enter cost price → Calc margin %'}
            {mode === 'markup' && '① Enter cost price → Next → ② Enter markup % (e.g. 30) → Calc'}
          </div>
        )}

        {/* History toggle */}
        <button
          onClick={() => { setShowHistory(!showHistory); if (!showHistory) fetchHistory(); }}
          style={{
            marginTop: '14px',
            width: '100%',
            background: showHistory ? '#1a1a3e' : '#0f0f2e',
            color: '#888',
            border: '1px solid #2a2a4e',
            borderRadius: '8px',
            padding: '8px',
            fontSize: '0.78rem',
            cursor: 'pointer',
            transition: 'all 0.15s',
          }}
        >
          {showHistory ? '▼ Hide History' : '▶ Show History'} ({history.length})
        </button>
      </div>

      {/* History panel */}
      {showHistory && (
        <HistoryPanel
          history={history}
          onClear={clearHistory}
          onClose={() => setShowHistory(false)}
          onSelect={(record) => {
            setResult(record.result);
            setExpression(record.expression);
          }}
        />
      )}
    </div>
  );
}
