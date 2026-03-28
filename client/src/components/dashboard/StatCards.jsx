import React from 'react'

function getTheme(riskPercent) {
  if (riskPercent <= 30) return {
    months: { bg: '#f0fdf4', border: '#bbf7d0', label: '#166534', value: '#15803d' },
    risk:   { bg: '#f0fdf4', border: '#bbf7d0', label: '#166534', value: '#15803d' },
    gap:    { bg: '#f0fdf4', border: '#bbf7d0', label: '#166534', value: '#15803d' },
  }
  if (riskPercent <= 60) return {
    months: { bg: '#f0fdf4', border: '#bbf7d0', label: '#166534', value: '#15803d' },
    risk:   { bg: '#fffbeb', border: '#fde68a', label: '#92400e', value: '#b45309' },
    gap:    { bg: '#fef2f2', border: '#fecaca', label: '#991b1b', value: '#dc2626' },
  }
  return {
    months: { bg: '#fef2f2', border: '#fecaca', label: '#991b1b', value: '#dc2626' },
    risk:   { bg: '#fef2f2', border: '#fecaca', label: '#991b1b', value: '#dc2626' },
    gap:    { bg: '#fef2f2', border: '#fecaca', label: '#991b1b', value: '#dc2626' },
  }
}

function StatCard({ bg, border, label, value, valueText, sub }) {
  return (
    <div style={{
      background: bg,
      border: `0.5px solid ${border}`,
      borderRadius: 16,
      padding: '16px 18px',
    }}>
      <p style={{ margin: '0 0 8px', fontSize: 11, fontWeight: 700, color: label, textTransform: 'uppercase', letterSpacing: '.06em' }}>
        {valueText}
      </p>
      <p style={{ margin: 0, fontSize: 36, fontWeight: 700, color: value, lineHeight: 1, fontFamily: "'DM Mono', monospace" }}>
        {label === '' ? '—' : label}
      </p>
      <p style={{ margin: '4px 0 0', fontSize: 12, color: label }}>{sub}</p>
    </div>
  )
}

export default function StatCards({ riskPercent = 0, survivalMonths = 0, monthlyGap = 0 }) {
  const t = getTheme(riskPercent)
  const pct = Math.min(100, Math.max(0, riskPercent))
  const months = Math.max(0, survivalMonths).toFixed(1)
  const gap = monthlyGap < 0
    ? `−$${Math.abs(Math.round(monthlyGap)).toLocaleString()}`
    : `+$${Math.round(monthlyGap).toLocaleString()}`

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0,1fr))', gap: 12 }}>

      {/* Months safe */}
      <div style={{ background: t.months.bg, border: `0.5px solid ${t.months.border}`, borderRadius: 20, padding: '24px 26px', overflow: 'hidden', minWidth: 0 }}>
        <p style={{ margin: '0 0 12px', fontSize: 12, fontWeight: 700, color: t.months.label, textTransform: 'uppercase', letterSpacing: '.06em' }}>
          Months safe
        </p>
        <p style={{ margin: 0, fontSize: 48, fontWeight: 700, color: t.months.value, lineHeight: 1, fontFamily: "'DM Mono', monospace", whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {months}
        </p>
        <p style={{ margin: '8px 0 0', fontSize: 14, color: t.months.label }}>before savings critical</p>
      </div>

      {/* Risk score */}
      <div style={{ background: t.risk.bg, border: `0.5px solid ${t.risk.border}`, borderRadius: 20, padding: '24px 26px', overflow: 'hidden', minWidth: 0 }}>
        <p style={{ margin: '0 0 12px', fontSize: 12, fontWeight: 700, color: t.risk.label, textTransform: 'uppercase', letterSpacing: '.06em' }}>
          Risk score
        </p>
        <p style={{ margin: 0, fontSize: 48, fontWeight: 700, color: t.risk.value, lineHeight: 1, fontFamily: "'DM Mono', monospace", whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {pct}%
        </p>
        <p style={{ margin: '8px 0 0', fontSize: 14, color: t.risk.label }}>chance of running out</p>
      </div>

      {/* Monthly gap */}
      <div style={{ background: t.gap.bg, border: `0.5px solid ${t.gap.border}`, borderRadius: 20, padding: '24px 26px', overflow: 'hidden', minWidth: 0 }}>
        <p style={{ margin: '0 0 12px', fontSize: 12, fontWeight: 700, color: t.gap.label, textTransform: 'uppercase', letterSpacing: '.06em' }}>
          Monthly gap
        </p>
        <p style={{ margin: 0, fontSize: 48, fontWeight: 700, color: t.gap.value, lineHeight: 1, fontFamily: "'DM Mono', monospace', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'" }}>
          {gap}
        </p>
        <p style={{ margin: '8px 0 0', fontSize: 14, color: t.gap.label }}>
          {monthlyGap < 0 ? 'shortfall per month' : 'surplus per month'}
        </p>
      </div>

    </div>
  )
}
