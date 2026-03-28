import React from 'react'

function getColor(p) {
  if (p <= 30) return { main: '#15803d', light: '#f0fdf4', border: '#bbf7d0', pill: '#166534', label: 'Low risk' }
  if (p <= 60) return { main: '#b45309', light: '#fffbeb', border: '#fde68a', pill: '#92400e', label: 'Moderate risk' }
  return { main: '#dc2626', light: '#fef2f2', border: '#fecaca', pill: '#991b1b', label: 'High risk' }
}

function LoadingDots({ color }) {
  return (
    <div style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
      {[0, 1, 2].map((i) => (
        <div key={i} style={{
          width: 6, height: 6, borderRadius: '50%', background: color,
          animation: `dotBounce 1.2s ease-in-out ${i * 0.2}s infinite`,
        }} />
      ))}
      <style>{`@keyframes dotBounce{0%,80%,100%{transform:scale(.6);opacity:.4}40%{transform:scale(1);opacity:1}}`}</style>
    </div>
  )
}

export default function VerdictCard({ verdict, loading, error, riskPercent = 0 }) {
  const c = getColor(riskPercent)

  return (
    <div style={{
      background: '#ffffff',
      border: '0.5px solid rgba(17,28,68,.1)',
      borderLeft: `4px solid ${c.main}`,
      borderRadius: 20,
      padding: '24px 28px',
    }}>

      {/* Header row */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
        <div style={{ width: 9, height: 9, borderRadius: '50%', background: c.main, flexShrink: 0 }} />
        <span style={{ fontSize: 13, fontWeight: 700, color: '#131936', textTransform: 'uppercase', letterSpacing: '.06em' }}>
          Verdict
        </span>
        <span style={{
          marginLeft: 'auto', fontSize: 12, fontWeight: 700,
          color: c.pill, background: c.light,
          padding: '4px 14px', borderRadius: 100,
          border: `0.5px solid ${c.border}`,
        }}>
          {c.label}
        </span>
      </div>

      {/* Body */}
      {loading && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <LoadingDots color={c.main} />
          <span style={{ fontSize: 15, color: '#131936', opacity: 0.5 }}>Analysing your scenario...</span>
        </div>
      )}

      {error && !loading && (
        <p style={{ margin: 0, fontSize: 15, color: '#dc2626', lineHeight: 1.65 }}>
          Could not load verdict. Check your connection and try again.
        </p>
      )}

      {!loading && !error && verdict && (
        <p style={{ margin: 0, fontSize: 15, color: '#131936', lineHeight: 1.8 }}
          dangerouslySetInnerHTML={{ __html: verdict }} />
      )}

      {!loading && !error && !verdict && (
        <p style={{ margin: 0, fontSize: 15, color: '#131936', lineHeight: 1.7, opacity: 0.5 }}>
          Select a scenario above to get your personalised verdict.
        </p>
      )}
    </div>
  )
}
