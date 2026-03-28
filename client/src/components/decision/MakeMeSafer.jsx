import React, { useState } from 'react'
import { runSimulation } from '../../engine/monteCarlo'
import { fetchSaferVerdict } from '../../services/api'

const navy = '#131936'
const C = { border: 'rgba(17,28,68,.08)', text3: '#8591b4' }

function LoadingDots() {
  return (
    <div style={{ display: 'flex', gap: 4 }}>
      {[0,1,2].map(i => (
        <div key={i} style={{
          width: 6, height: 6, borderRadius: '50%', background: '#15803d',
          animation: `dotBounce 1.2s ease-in-out ${i*0.2}s infinite`,
        }}/>
      ))}
      <style>{`@keyframes dotBounce{0%,80%,100%{transform:scale(.6);opacity:.4}40%{transform:scale(1);opacity:1}}`}</style>
    </div>
  )
}

// Monte Carlo reverse calc — same scenarios, increment savings until risk < 20%
function calcSavingsTarget(profile, activeScenarios, targetRisk = 20) {
  const currentResult = runSimulation(profile, activeScenarios)

  if (currentResult.riskPercent <= targetRisk) {
    return {
      current: currentResult,
      target: Number(profile.savings),
      gap: 0,
      alreadySafe: true,
    }
  }

  let testSavings = Number(profile.savings)
  let result = currentResult
  let steps = 0
  const MAX = 200 // $100k search range

  while (result.riskPercent > targetRisk && steps < MAX) {
    testSavings += 500
    steps++
    result = runSimulation({ ...profile, savings: testSavings }, activeScenarios)
  }

  return {
    current: currentResult,
    target: testSavings,
    gap: testSavings - Number(profile.savings),
    alreadySafe: false,
  }
}

function buildFallback(gap, target, monthsAt200, monthsAt500) {
  if (gap === 0) return `You're already below 20% risk with these scenarios — your current savings are enough. Keep building that buffer.`
  return `You need $${gap.toLocaleString()} more in savings to get your risk below 20% under these scenarios. Saving $500/month gets you there in ${monthsAt500} months, or $200/month in ${monthsAt200} months.`
}

export default function MakeMeSafer({ profile, activeScenarios, currentRiskPercent, currentSurvivalMonths }) {
  const [result, setResult]   = useState(null)
  const [verdict, setVerdict] = useState(null)
  const [loading, setLoading] = useState(false)
  const [ran, setRan]         = useState(false)

  const currentSavings = Number(profile?.savings) || 0

  async function handleCalculate() {
    setLoading(true)
    setVerdict(null)
    setRan(true)

    const calc = calcSavingsTarget(profile, activeScenarios, 20)
    const gap = calc.gap
    const monthsAt200 = gap > 0 ? Math.ceil(gap / 200) : 0
    const monthsAt500 = gap > 0 ? Math.ceil(gap / 500) : 0
    const progress = calc.alreadySafe ? 100 : Math.min(99, Math.round((currentSavings / calc.target) * 100))

    setResult({ ...calc, gap, monthsAt200, monthsAt500, progress })

    const text = await fetchSaferVerdict({
      profile,
      riskPercent: currentRiskPercent,
      survivalMonths: currentSurvivalMonths,
      targetRisk: 20,
    })
    setVerdict(text || buildFallback(gap, calc.target, monthsAt200, monthsAt500))
    setLoading(false)
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginTop: 4 }}>

      {/* Header */}
      <div style={{
        background: '#fff', border: `0.5px solid ${C.border}`,
        borderRadius: 16, padding: 22,
      }}>
        <p style={{ margin: '0 0 6px', fontSize: 15, fontWeight: 700, color: navy }}>
          How much do I need to save?
        </p>
        <p style={{ margin: '0 0 16px', fontSize: 13, color: navy, opacity: .5 }}>
          Based on your active scenarios — we'll find the savings amount that brings your risk below 20%.
        </p>

        <button
          onClick={handleCalculate}
          disabled={loading}
          style={{
            width: '100%', padding: '13px 0',
            borderRadius: 100, fontSize: 14, fontWeight: 700,
            fontFamily: 'inherit', cursor: loading ? 'not-allowed' : 'pointer',
            background: navy, color: '#fff', border: 'none',
            opacity: loading ? 0.7 : 1, transition: 'all .2s',
            boxShadow: '0 4px 16px rgba(19,25,54,.2)',
          }}
        >
          {loading ? '⏳ Calculating...' : ran ? '↻ Recalculate' : 'Calculate my savings target'}
        </button>
      </div>

      {/* Result */}
      {result && (
        <div style={{ background: '#fff', border: `0.5px solid ${C.border}`, borderRadius: 16, padding: 22 }}>

          {result.alreadySafe ? (
            <div style={{ background: '#f0fdf4', border: '0.5px solid #bbf7d0', borderRadius: 12, padding: 16 }}>
              <p style={{ margin: 0, fontSize: 15, fontWeight: 700, color: '#15803d' }}>You're already below 20% risk 🎉</p>
              <p style={{ margin: '6px 0 0', fontSize: 13, color: '#166534' }}>
                Your current savings are enough to handle these specific scenarios safely.
              </p>
            </div>
          ) : (
            <>
              <p style={{ margin: '0 0 4px', fontSize: 13, fontWeight: 700, color: navy }}>
                Savings target to get below 20% risk
              </p>
              <p style={{ margin: '0 0 14px', fontSize: 12, color: navy, opacity: .4 }}>
                With your active scenarios applied
              </p>

              <div style={{ fontSize: 52, fontWeight: 700, color: navy, fontFamily: "'DM Mono', monospace", lineHeight: 1, marginBottom: 6 }}>
                ${result.target.toLocaleString()}
              </div>
              <p style={{ margin: '0 0 18px', fontSize: 14, color: navy, opacity: .6 }}>
                You have ${currentSavings.toLocaleString()} — you need{' '}
                <strong style={{ color: navy, opacity: 1 }}>${result.gap.toLocaleString()} more</strong>
              </p>

              {/* Progress bar */}
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, fontWeight: 700, color: navy, marginBottom: 8 }}>
                <span>Now: ${currentSavings.toLocaleString()}</span>
                <span style={{ color: '#15803d' }}>Target: ${result.target.toLocaleString()}</span>
              </div>
              <div style={{ background: '#f0fdf4', borderRadius: 4, height: 14, overflow: 'hidden', border: '0.5px solid #bbf7d0' }}>
                <div style={{
                  width: `${result.progress}%`, height: '100%', background: '#15803d', borderRadius: 4,
                  transition: 'width 0.8s cubic-bezier(.4,0,.2,1)',
                }}/>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8, marginBottom: 16 }}>
                <span style={{ fontSize: 12, color: navy, opacity: .4 }}>0</span>
                <span style={{ fontSize: 12, fontWeight: 700, color: '#15803d' }}>{result.progress}% of the way there</span>
              </div>

              {/* Saving timelines */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                <div style={{ background: '#f3f5fa', borderRadius: 10, padding: '12px 14px' }}>
                  <p style={{ margin: '0 0 4px', fontSize: 11, fontWeight: 700, color: navy, opacity: .5, textTransform: 'uppercase', letterSpacing: '.06em' }}>Saving $200/mo</p>
                  <p style={{ margin: 0, fontSize: 20, fontWeight: 700, color: navy, fontFamily: "'DM Mono', monospace" }}>{result.monthsAt200} months</p>
                </div>
                <div style={{ background: '#f3f5fa', borderRadius: 10, padding: '12px 14px' }}>
                  <p style={{ margin: '0 0 4px', fontSize: 11, fontWeight: 700, color: navy, opacity: .5, textTransform: 'uppercase', letterSpacing: '.06em' }}>Saving $500/mo</p>
                  <p style={{ margin: 0, fontSize: 20, fontWeight: 700, color: navy, fontFamily: "'DM Mono', monospace" }}>{result.monthsAt500} months</p>
                </div>
              </div>
            </>
          )}
        </div>
      )}

      {/* Claude action plan */}
      {(loading || verdict) && (
        <div style={{
          background: '#fff', border: `0.5px solid ${C.border}`,
          borderLeft: '3.5px solid #15803d',
          borderRadius: 12, padding: '20px 22px',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#15803d', flexShrink: 0 }}/>
            <span style={{ fontSize: 11, fontWeight: 700, color: navy, textTransform: 'uppercase', letterSpacing: '.06em' }}>Your action plan</span>
          </div>
          {loading ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <LoadingDots/>
              <span style={{ fontSize: 14, color: C.text3 }}>Building your plan...</span>
            </div>
          ) : (
            <p style={{ margin: 0, fontSize: 15, color: navy, lineHeight: 1.8 }}>{verdict}</p>
          )}
        </div>
      )}
    </div>
  )
}
