import React, { useState } from 'react'

function getColor(p) {
  if (p <= 30) return { main: '#15803d', label: 'Low risk' }
  if (p <= 60) return { main: '#b45309', label: 'Moderate risk' }
  return { main: '#dc2626', label: 'High risk' }
}

export default function RiskGauge({ riskPercent = 0 }) {
  const pct = Math.min(100, Math.max(0, riskPercent))
  const c = getColor(pct)
  const [showTooltip, setShowTooltip] = useState(false)

  // Rotate needle: 0% = -90deg (pointing left), 100% = 90deg (pointing right)
  const rotation = -90 + (pct / 100) * 180

  return (
    <div style={{
      background: '#ffffff',
      border: '0.5px solid rgba(19,25,54,.1)',
      borderRadius: 20,
      padding: '28px 32px 24px',
      position: 'relative',
    }}>

      {/* Header row */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
        <p style={{
          margin: 0, fontSize: 13, fontWeight: 700,
          color: '#131936', textTransform: 'uppercase', letterSpacing: '.06em',
        }}>
          Risk of running out of money
        </p>

        {/* ⓘ button — top right */}
        <div style={{ position: 'relative' }}>
          <div
            onMouseEnter={() => setShowTooltip(true)}
            onMouseLeave={() => setShowTooltip(false)}
            style={{
              width: 20, height: 20, borderRadius: '50%',
              background: 'rgba(19,25,54,.08)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'help', fontSize: 11, fontWeight: 700, color: '#131936',
            }}
          >
            i
          </div>

          {/* Tooltip — drops down from top right */}
          {showTooltip && (
            <div style={{
              position: 'absolute',
              top: 28, right: 0,
              background: '#131936',
              color: '#fff',
              fontSize: 12, lineHeight: 1.65,
              padding: '12px 16px',
              borderRadius: 12,
              width: 280,
              zIndex: 20,
              boxShadow: '0 8px 24px rgba(0,0,0,.2)',
              pointerEvents: 'none',
            }}>
              We run 1,000 simulated versions of your financial future, each with slightly different random expenses and timing. The percentage shows how many of those simulations ended with you running out of money.
            </div>
          )}
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 40 }}>
        {/* SVG Gauge */}
        <div style={{ position: 'relative', width: 240, flexShrink: 0 }}>
          <svg width="240" height="130" viewBox="0 0 220 110">
            <defs>
              <linearGradient id="gaugeGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%"   stopColor="#22c55e" />
                <stop offset="40%"  stopColor="#f59e0b" />
                <stop offset="100%" stopColor="#ef4444" />
              </linearGradient>
            </defs>
            {/* Track */}
            <path d="M 18 100 A 92 92 0 0 1 202 100" fill="none" stroke="rgba(19,25,54,.08)" strokeWidth="15" strokeLinecap="round"/>
            {/* Coloured arc */}
            <path d="M 18 100 A 92 92 0 0 1 202 100" fill="none" stroke="url(#gaugeGrad)" strokeWidth="15" strokeLinecap="round"/>
            {/* Needle — rotates around centre point using CSS transform */}
            <line
              x1="110" y1="100"
              x2="110" y2="18"
              stroke="#111c44"
              strokeWidth="3"
              strokeLinecap="round"
              style={{
                transformOrigin: '110px 100px',
                transform: `rotate(${rotation}deg)`,
                transition: 'transform 0.7s cubic-bezier(.4,0,.2,1)',
              }}
            />
            {/* Centre dot */}
            <circle cx="110" cy="100" r="6" fill="#111c44"/>
          </svg>

          {/* 0% and 100% labels — below the arc ends */}
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: -8, paddingLeft: 12, paddingRight: 8 }}>
            <span style={{ fontSize: 11, color: '#131936', fontWeight: 600 }}>0%</span>
            <span style={{ fontSize: 11, color: '#131936', fontWeight: 600 }}>100%</span>
          </div>
        </div>

        {/* Number + label */}
        <div>
          <div style={{
            fontSize: 72, fontWeight: 700, color: c.main,
            lineHeight: 1, fontFamily: "'DM Mono', monospace",
            transition: 'color 0.4s ease',
          }}>
            {pct}%
          </div>
          <div style={{
            fontSize: 18, fontWeight: 700, color: c.main,
            marginTop: 8, transition: 'color 0.4s ease',
          }}>
            {c.label}
          </div>
          <div style={{ fontSize: 14, color: '#131936', marginTop: 8, lineHeight: 1.6, opacity: 0.5 }}>
            Based on 1,000<br />simulated scenarios
          </div>
        </div>
      </div>
    </div>
  )
}


