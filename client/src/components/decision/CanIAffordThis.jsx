import React, { useState } from 'react'
import { runSimulation } from '../../engine/monteCarlo'
import { fetchAffordVerdict } from '../../services/api'

const navy = '#131936'
const C = {
  border: 'rgba(17,28,68,.08)',
  soft: 'rgba(17,28,68,.05)',
  text3: '#8591b4',
}

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
          cursor: 'help', fontSize: 11, fontWeight: 700, color: navy, flexShrink: 0,
        }}
      >i</div>
      {show && (
        <div style={{
          position: 'absolute', top: 24, right: 0,
          background: 'rgba(255,255,255,.95)', backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)', color: navy,
          fontSize: 12, lineHeight: 1.65, padding: '10px 14px',
          borderRadius: 10, width: 220, zIndex: 50,
          border: '1px solid rgba(19,25,54,.12)',
          boxShadow: '0 8px 24px rgba(19,25,54,.15)',
          pointerEvents: 'none',
        }}>{text}</div>
      )}
    </div>
  )
}

function getRiskTheme(p) {
  if (p <= 30) return { bg: '#f0fdf4', border: '#bbf7d0', label: '#166534', value: '#15803d' }
  if (p <= 60) return { bg: '#fffbeb', border: '#fde68a', label: '#92400e', value: '#b45309' }
  return { bg: '#fef2f2', border: '#fecaca', label: '#991b1b', value: '#dc2626' }
}

function buildAffordFallback(cost, riskBefore, riskAfter, runwayBefore, runwayAfter) {
  const diff = riskAfter - riskBefore
  if (diff > 30) {
    return `Spending $${Number(cost).toLocaleString()} now would seriously hurt your safety net — your runway drops from ${Number(runwayBefore).toFixed(1)} to ${Number(runwayAfter).toFixed(1)} months. If you can hold off and build your savings first, this becomes a much safer purchase.`
  }
  if (diff > 10) {
    return `This purchase increases your risk by ${diff}% — manageable, but worth being aware of. Your runway drops from ${Number(runwayBefore).toFixed(1)} to ${Number(runwayAfter).toFixed(1)} months. Make sure you have no other big expenses coming up.`
  }
  return `Good news — spending $${Number(cost).toLocaleString()} has minimal impact on your financial safety. Your risk only moves by ${diff}% and you still have ${Number(runwayAfter).toFixed(1)} months of runway.`
}

export default function CanIAffordThis({ profile, activeScenarios }) {
  const [cost, setCost]         = useState('')
  const [result, setResult]     = useState(null)
  const [verdict, setVerdict]   = useState(null)
  const [loading, setLoading]   = useState(false)
  const [checked, setChecked]   = useState(false)

  async function handleCheck() {
    const costNum = Number(cost)
    if (!costNum || costNum <= 0) return

    setLoading(true)
    setVerdict(null)
    setChecked(true)

    // Run simulation before and after
    const before = runSimulation(profile, activeScenarios)
    const modifiedProfile = {
      ...profile,
      savings: Math.max(0, Number(profile.savings) - costNum),
    }
    const after = runSimulation(modifiedProfile, activeScenarios)

    setResult({ before, after, cost: costNum })

    // Get Claude verdict
    const text = await fetchAffordVerdict({
      profile,
      cost: costNum,
      riskBefore: before.riskPercent,
      riskAfter: after.riskPercent,
      runwayBefore: before.survivalMonths,
      runwayAfter: after.survivalMonths,
    })
    setVerdict(text || buildAffordFallback(costNum, before.riskPercent, after.riskPercent, before.survivalMonths, after.survivalMonths))
    setLoading(false)
  }

  const verdictColor = result
    ? getRiskTheme(result.after.riskPercent).value
    : navy

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

      {/* Input */}
      <div style={{ background: '#fff', border: `0.5px solid ${C.border}`, borderRadius: 16, padding: 22 }}>
        <p style={{ margin: '0 0 10px', fontSize: 13, fontWeight: 700, color: navy }}>
          How much do you want to spend?
        </p>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          <div style={{
            display: 'flex', alignItems: 'center',
            background: '#f3f5fa', border: '1.5px solid rgba(17,28,68,.12)',
            borderRadius: 10, height: 48, flex: 1, overflow: 'hidden',
          }}>
            <div style={{
              padding: '0 14px', fontSize: 14, fontWeight: 700, color: navy,
              borderRight: '1px solid rgba(17,28,68,.1)', height: '100%',
              display: 'flex', alignItems: 'center',
            }}>$</div>
            <input
              type="number"
              min="0"
              value={cost}
              onChange={e => { setCost(e.target.value); setChecked(false); setResult(null); setVerdict(null) }}
              placeholder="e.g. 8,000"
              style={{
                flex: 1, border: 'none', outline: 'none',
                background: 'transparent', padding: '0 16px',
                fontSize: 18, fontWeight: 700, color: navy,
                fontFamily: "'DM Mono', monospace",
              }}
            />
          </div>
          <button
            onClick={handleCheck}
            disabled={!cost || Number(cost) <= 0 || loading}
            style={{
              padding: '0 28px', height: 48,
              background: !cost || Number(cost) <= 0 ? 'rgba(19,25,54,.12)' : navy,
              color: !cost || Number(cost) <= 0 ? 'rgba(19,25,54,.35)' : '#fff',
              border: 'none', borderRadius: 100,
              fontSize: 14, fontWeight: 700, fontFamily: 'inherit',
              cursor: !cost || Number(cost) <= 0 ? 'not-allowed' : 'pointer',
              whiteSpace: 'nowrap', transition: 'all .2s',
            }}
          >
            {loading ? 'Checking...' : 'Check it'}
          </button>
        </div>
      </div>

      {/* Before / After */}
      {result && (
        <>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>

            {/* Before */}
            {(() => {
              const t = getRiskTheme(result.before.riskPercent)
              return (
                <div style={{ background: t.bg, border: `0.5px solid ${t.border}`, borderRadius: 16, padding: 20 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
                    <p style={{ margin: 0, fontSize: 11, fontWeight: 700, color: t.label, textTransform: 'uppercase', letterSpacing: '.06em' }}>Before</p>
                    <InfoButton text="Your risk and runway before making this purchase." />
                  </div>
                  <p style={{ margin: '0 0 8px', fontSize: 44, fontWeight: 700, color: t.value, fontFamily: "'DM Mono', monospace", lineHeight: 1 }}>
                    {result.before.riskPercent}%
                  </p>
                  <p style={{ margin: 0, fontSize: 13, fontWeight: 600, color: t.label }}>
                    {Number(result.before.survivalMonths).toFixed(1)} months safe
                  </p>
                </div>
              )
            })()}

            {/* After */}
            {(() => {
              const t = getRiskTheme(result.after.riskPercent)
              return (
                <div style={{ background: t.bg, border: `0.5px solid ${t.border}`, borderRadius: 16, padding: 20 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
                    <p style={{ margin: 0, fontSize: 11, fontWeight: 700, color: t.label, textTransform: 'uppercase', letterSpacing: '.06em' }}>After spending ${Number(cost).toLocaleString()}</p>
                    <InfoButton text="Your risk and runway after this purchase is deducted from your savings." />
                  </div>
                  <p style={{ margin: '0 0 8px', fontSize: 44, fontWeight: 700, color: t.value, fontFamily: "'DM Mono', monospace", lineHeight: 1 }}>
                    {result.after.riskPercent}%
                  </p>
                  <p style={{ margin: 0, fontSize: 13, fontWeight: 600, color: t.label }}>
                    {Number(result.after.survivalMonths).toFixed(1)} months safe
                  </p>
                </div>
              )
            })()}
          </div>

          {/* Verdict */}
          <div style={{
            background: '#fff', border: `0.5px solid ${C.border}`,
            borderLeft: `3.5px solid ${verdictColor}`,
            borderRadius: 12, padding: '18px 20px',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: verdictColor, flexShrink: 0 }} />
              <span style={{ fontSize: 11, fontWeight: 700, color: navy, textTransform: 'uppercase', letterSpacing: '.06em' }}>Verdict</span>
            </div>
            {loading ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <LoadingDots color={verdictColor} />
                <span style={{ fontSize: 14, color: C.text3 }}>Analysing your purchase...</span>
              </div>
            ) : (
              <p style={{ margin: 0, fontSize: 15, color: navy, lineHeight: 1.8 }}>{verdict}</p>
            )}
          </div>
        </>
      )}

      {/* Empty state */}
      {!checked && (
        <div style={{
          display: 'flex', flexDirection: 'column', alignItems: 'center',
          justifyContent: 'center', minHeight: 200, gap: 12, textAlign: 'center',
          background: '#fff', border: `0.5px solid ${C.border}`, borderRadius: 16, padding: 32,
        }}>
          <p style={{ fontSize: 16, fontWeight: 700, color: navy, margin: 0 }}>Enter an amount above</p>
          <p style={{ fontSize: 13, color: C.text3, margin: 0, maxWidth: 260, lineHeight: 1.6 }}>
            We'll show you exactly how this purchase affects your financial safety before you commit.
          </p>
        </div>
      )}
    </div>
  )
}

function LoadingDots({ color }) {
  return (
    <div style={{ display: 'flex', gap: 4 }}>
      {[0, 1, 2].map(i => (
        <div key={i} style={{
          width: 6, height: 6, borderRadius: '50%', background: color,
          animation: `dotBounce 1.2s ease-in-out ${i * 0.2}s infinite`,
        }} />
      ))}
      <style>{`@keyframes dotBounce{0%,80%,100%{transform:scale(.6);opacity:.4}40%{transform:scale(1);opacity:1}}`}</style>
    </div>
  )
}
