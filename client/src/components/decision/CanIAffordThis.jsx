import React, { useState } from 'react'
import { fetchAffordVerdict } from '../../services/api'

const navy = '#131936'
const C = { border: 'rgba(17,28,68,.08)', text3: '#8591b4' }

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

// Pure savings math — no Monte Carlo
function calcAfford(profile, cost) {
  const savings  = Number(profile.savings)  || 0
  const expenses = Number(profile.expenses) || 0
  const income   = Number(profile.income)   || 0
  const debt     = Number(profile.debt)     || 0
  const monthlySurplus = income - expenses - debt

  const savingsAfter   = Math.max(0, savings - cost)
  const bufferBefore   = expenses > 0 ? savings / expenses : 0
  const bufferAfter    = expenses > 0 ? savingsAfter / expenses : 0
  const canCover       = savings >= cost
  const surplusMonths  = monthlySurplus > 0 ? cost / monthlySurplus : null

  // Risk rating based on buffer after purchase
  let riskAfter
  if (bufferAfter >= 6)      riskAfter = 'low'
  else if (bufferAfter >= 3) riskAfter = 'moderate'
  else                       riskAfter = 'high'

  let riskBefore
  if (bufferBefore >= 6)      riskBefore = 'low'
  else if (bufferBefore >= 3) riskBefore = 'moderate'
  else                        riskBefore = 'high'

  return {
    savings, savingsAfter, cost,
    bufferBefore: Math.round(bufferBefore * 10) / 10,
    bufferAfter:  Math.round(bufferAfter  * 10) / 10,
    riskBefore, riskAfter,
    canCover, monthlySurplus,
    surplusMonths: surplusMonths ? Math.ceil(surplusMonths) : null,
  }
}

function getTheme(risk) {
  if (risk === 'low')      return { bg: '#f0fdf4', border: '#bbf7d0', label: '#166534', value: '#15803d' }
  if (risk === 'moderate') return { bg: '#fffbeb', border: '#fde68a', label: '#92400e', value: '#b45309' }
  return { bg: '#fef2f2', border: '#fecaca', label: '#991b1b', value: '#dc2626' }
}

function riskLabel(risk) {
  if (risk === 'low')      return 'Low risk'
  if (risk === 'moderate') return 'Moderate risk'
  return 'High risk'
}

function buildFallback(result) {
  const { bufferBefore, bufferAfter, riskAfter, canCover, cost, savingsAfter, surplusMonths } = result
  if (!canCover) {
    return `This purchase costs more than your current savings — you'd need to borrow $${(cost - result.savings).toLocaleString()} to cover it. That puts you in debt before any life shock even happens. Hold off until you've saved more.`
  }
  if (riskAfter === 'high') {
    return `After this purchase you'd have ${bufferAfter} months of expenses left in savings — that's dangerously low. One unexpected bill could wipe you out completely. ${surplusMonths ? `If you wait ${surplusMonths} months and save your surplus first, you can afford this without touching your safety net.` : 'Build your buffer first before making this purchase.'}`
  }
  if (riskAfter === 'moderate') {
    return `This purchase is manageable — you'd still have ${bufferAfter} months of expenses saved. It's not dangerous, but your cushion gets thin. Make sure you have no other big expenses coming up before committing.`
  }
  return `You can comfortably afford this. After the purchase you'd still have $${savingsAfter.toLocaleString()} saved — that's ${bufferAfter} months of expenses as a buffer. You're in a solid position.`
}

function LoadingDots({ color }) {
  return (
    <div style={{ display: 'flex', gap: 4 }}>
      {[0,1,2].map(i => (
        <div key={i} style={{
          width: 6, height: 6, borderRadius: '50%', background: color,
          animation: `dotBounce 1.2s ease-in-out ${i*0.2}s infinite`,
        }}/>
      ))}
      <style>{`@keyframes dotBounce{0%,80%,100%{transform:scale(.6);opacity:.4}40%{transform:scale(1);opacity:1}}`}</style>
    </div>
  )
}

export default function CanIAffordThis({ profile }) {
  const [cost, setCost]       = useState('')
  const [result, setResult]   = useState(null)
  const [verdict, setVerdict] = useState(null)
  const [loading, setLoading] = useState(false)
  const [checked, setChecked] = useState(false)

  async function handleCheck() {
    const costNum = Number(cost)
    if (!costNum || costNum <= 0) return

    setLoading(true)
    setVerdict(null)
    setChecked(true)

    const calc = calcAfford(profile, costNum)
    setResult(calc)

    // Map to what API expects
    const text = await fetchAffordVerdict({
      profile,
      cost: costNum,
      riskBefore:   calc.riskBefore,
      riskAfter:    calc.riskAfter,
      runwayBefore: calc.bufferBefore,
      runwayAfter:  calc.bufferAfter,
    })
    setVerdict(text || buildFallback(calc))
    setLoading(false)
  }

  const verdictColor = result ? getTheme(result.riskAfter).value : navy

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
              type="number" min="0" value={cost}
              onChange={e => { setCost(e.target.value); setChecked(false); setResult(null); setVerdict(null) }}
              placeholder="e.g. 5,000"
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
              const t = getTheme(result.riskBefore)
              return (
                <div style={{ background: t.bg, border: `0.5px solid ${t.border}`, borderRadius: 16, padding: 20 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
                    <p style={{ margin: 0, fontSize: 11, fontWeight: 700, color: t.label, textTransform: 'uppercase', letterSpacing: '.06em' }}>Before</p>
                    <InfoButton text="How many months of expenses your savings cover right now." />
                  </div>
                  <p style={{ margin: '0 0 6px', fontSize: 44, fontWeight: 700, color: t.value, fontFamily: "'DM Mono', monospace", lineHeight: 1 }}>
                    {result.bufferBefore}
                  </p>
                  <p style={{ margin: '0 0 8px', fontSize: 13, fontWeight: 600, color: t.label }}>months of expenses covered</p>
                  <p style={{ margin: 0, fontSize: 12, color: t.label, opacity: .8 }}>{riskLabel(result.riskBefore)}</p>
                </div>
              )
            })()}

            {/* After */}
            {(() => {
              const t = getTheme(result.riskAfter)
              return (
                <div style={{ background: t.bg, border: `0.5px solid ${t.border}`, borderRadius: 16, padding: 20 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
                    <p style={{ margin: 0, fontSize: 11, fontWeight: 700, color: t.label, textTransform: 'uppercase', letterSpacing: '.06em' }}>After spending ${Number(cost).toLocaleString()}</p>
                    <InfoButton text="How many months of expenses your savings cover after this purchase." />
                  </div>
                  <p style={{ margin: '0 0 6px', fontSize: 44, fontWeight: 700, color: t.value, fontFamily: "'DM Mono', monospace", lineHeight: 1 }}>
                    {result.canCover ? result.bufferAfter : '0'}
                  </p>
                  <p style={{ margin: '0 0 8px', fontSize: 13, fontWeight: 600, color: t.label }}>months of expenses covered</p>
                  <p style={{ margin: 0, fontSize: 12, color: t.label, opacity: .8 }}>
                    {result.canCover ? riskLabel(result.riskAfter) : "Can't cover this cost"}
                  </p>
                </div>
              )
            })()}
          </div>

          {/* Savings remaining pill */}
          <div style={{
            background: '#fff', border: `0.5px solid ${C.border}`,
            borderRadius: 12, padding: '14px 20px',
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          }}>
            <span style={{ fontSize: 13, color: navy, fontWeight: 600 }}>Savings remaining after purchase</span>
            <span style={{
              fontSize: 18, fontWeight: 700, color: result.canCover ? '#15803d' : '#dc2626',
              fontFamily: "'DM Mono', monospace",
            }}>
              {result.canCover ? `$${result.savingsAfter.toLocaleString()}` : `−$${(result.cost - result.savings).toLocaleString()} shortfall`}
            </span>
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
          <p style={{ fontSize: 13, color: C.text3, margin: 0, maxWidth: 280, lineHeight: 1.6 }}>
            We'll show you exactly how this purchase affects your financial safety before you commit.
          </p>
        </div>
      )}
    </div>
  )
}
