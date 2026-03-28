import React from 'react'

export default function RiskGauge({ riskPercent = 0 }) {
  const angle = (riskPercent / 100) * 180

  function getColor(p) {
    if (p <= 30) return '#22c55e'
    if (p <= 60) return '#f59e0b'
    return '#ef4444'
  }

  const color = getColor(riskPercent)

  return (
    <div style={container}>
      <div style={title}>RISK OF RUNNING OUT</div>

      <div style={gaugeWrapper}>
        <div style={arc} />

        <div
          style={{
            ...needle,
            transform: `rotate(${angle - 90}deg)`,
          }}
        />

        <div style={centerDot} />

        <div style={percent}>{riskPercent}%</div>
      </div>

      <div style={{ ...label, color }}>
        {riskPercent > 60 ? 'High risk' : riskPercent > 30 ? 'Moderate risk' : 'Low risk'}
      </div>
    </div>
  )
}

const container = {
  padding: 20,
  borderRadius: 20,
  background: '#0f172a',
  color: '#fff',
  display: 'flex',
  flexDirection: 'column',
  gap: 12,
}

const title = {
  fontSize: 12,
  letterSpacing: '0.1em',
  opacity: 0.6,
}

const gaugeWrapper = {
  position: 'relative',
  height: 120,
}

const arc = {
  width: '100%',
  height: 100,
  borderTopLeftRadius: 100,
  borderTopRightRadius: 100,
  background:
    'conic-gradient(from 180deg, #22c55e 0deg, #f59e0b 90deg, #ef4444 180deg)',
}

const needle = {
  position: 'absolute',
  bottom: 0,
  left: '50%',
  width: 2,
  height: 80,
  background: '#fff',
  transformOrigin: 'bottom center',
}

const centerDot = {
  position: 'absolute',
  bottom: 0,
  left: '50%',
  width: 10,
  height: 10,
  borderRadius: '50%',
  background: '#fff',
  transform: 'translateX(-50%)',
}

const percent = {
  position: 'absolute',
  bottom: 10,
  width: '100%',
  textAlign: 'center',
  fontSize: 20,
  fontWeight: 'bold',
}

const label = {
  fontSize: 14,
  fontWeight: 600,
}