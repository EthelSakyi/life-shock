import React, { useState } from 'react'

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

// Reusable info button + tooltip — matches RiskGauge style
function InfoButton({ text }) {
  const [show, setShow] = useState(false)
  return (
    <div style={{ position: 'relative', display: 'inline-flex' }}>
      <div
        onMouseEnter={() => setShow(true)}
        onMouseLeave={() => setShow(false)}
        style={{
          width: 18, height: 18, borderRadius: '50%',
          background: 'rgba(19,25,54,.1)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          cursor: 'help', fontSize: 11, fontWeight: 700, color: '#131936',
          flexShrink: 0,
        }}
      >
        i
      </div>
      {show && (
        <div style={{
          position: 'absolute',
          top: 26, right: 0,
          background: 'rgba(255,255,255,.95)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          color: '#131936',
          fontSize: 12, lineHeight: 1.65,
          padding: '10px 14px', borderRadius: 10,
          width: 220, zIndex: 50,
          border: '1px solid rgba(19,25,54,.12)',
          boxShadow: '0 8px 24px rgba(19,25,54,.15)',
          pointerEvents: 'none',
        }}>
          {text}
        </div>
      )}
    </div>
  )
}

// Individual stat card
function StatCard({ bg, border, labelColor, valueColor, title, value, sub, tooltip }) {
  return (
    <div style={{
      background: bg, border: `0.5px solid ${border}`,
      borderRadius: 20, padding: '20px 22px',
      overflow: 'hidden', minWidth: 0, position: 'relative',
    }}>
      {/* Header row — title + i icon */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
        <p style={{ margin: 0, fontSize: 12, fontWeight: 700, color: labelColor, textTransform: 'uppercase', letterSpacing: '.06em' }}>
          {title}
        </p>
        <InfoButton text={tooltip} />
      </div>

      {/* Value */}
      <p style={{
        margin: 0, fontSize: 48, fontWeight: 700, color: valueColor,
        lineHeight: 1, fontFamily: "'DM Mono', monospace",
        whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
      }}>
        {value}
      </p>

      {/* Sub label */}
      <p style={{ margin: '8px 0 0', fontSize: 14, color: labelColor }}>{sub}</p>
    </div>
  )
}

export default function StatCards({ riskPercent = 0, survivalMonths = 0, monthlyGap = 0 }) {
  const t = getTheme(riskPercent)
  const pct    = Math.min(100, Math.max(0, riskPercent))
  const months = Math.max(0, survivalMonths).toFixed(1)
  const gap    = monthlyGap < 0
    ? `−$${Math.abs(Math.round(monthlyGap)).toLocaleString()}`
    : `+$${Math.round(monthlyGap).toLocaleString()}`

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0,1fr))', gap: 12 }}>

      <StatCard
        bg={t.months.bg} border={t.months.border}
        labelColor={t.months.label} valueColor={t.months.value}
        title="Months safe"
        value={months}
        sub="before savings critical"
        tooltip="How many months your savings can cover your expenses before they run out, given your active scenarios. Lower is more urgent."
      />

      <StatCard
        bg={t.risk.bg} border={t.risk.border}
        labelColor={t.risk.label} valueColor={t.risk.value}
        title="Risk score"
        value={`${pct}%`}
        sub="chance of running out"
        tooltip="Out of 1,000 simulated futures, this is the percentage where your money ran out. Above 60% means most simulations ended badly."
      />

      <StatCard
        bg={t.gap.bg} border={t.gap.border}
        labelColor={t.gap.label} valueColor={t.gap.value}
        title="Monthly gap"
        value={gap}
        sub={monthlyGap < 0 ? 'shortfall per month' : 'surplus per month'}
        tooltip="Your income minus your expenses and any new monthly costs from your active scenarios. A negative number means you're spending more than you earn each month."
      />

    </div>
  )
}
