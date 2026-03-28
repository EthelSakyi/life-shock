import React, { useState } from 'react'
import { runSimulation } from '../../engine/monteCarlo'
import { fetchSaferVerdict } from '../../services/api'

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

function getRiskTheme(p) {
  if (p <= 30) return { bg: '#f0fdf4', border: '#bbf7d0', label: '#166534', value: '#15803d' }
  if (p <= 60) return { bg: '#fffbeb', border: '#fde68a', label: '#92400e', value: '#b45309' }
  return { bg: '#fef2f2', border: '#fecaca', label: '#991b1b', value: '#dc2626' }
}

// Reverse calculation — increment savings by $500 until risk < 20%
function calcSavingsTarget(profile, activeScenarios = [], targetRisk = 20) {
  const current = runSimulation(profile, activeScenarios)
  if (current.riskPercent <= targetRisk) return { target: Number(profile.savings), gap: 0, current }

  let testSavings = Number(profile.savings)
  let iterations  = 0
  const MAX = 200 // safety cap

  while (iterations < MAX) {
    testSavings += 500
    iterations++
    const test = runSimulation({ ...profile, savings: testSavings }, activeScenarios)
    if (test.riskPercent <= targetRisk) {
      return {
        target: testSavings,
        gap: testSavings - Number(profile.savings),
        current,
      }
    }
  }

  // If we never hit 20%, return best we found
  return {
    target: testSavings,
    gap: testSavings - Number(profile.savings),
    current,
  }
}

function buildSaferFallback(gap, target, riskPercent) {
  const months = Math.ceil(gap / 500)
  return `You need $${gap.toLocaleString()} more in savings to get your risk below 20%. Saving $500/month gets you there in ${months} months. Start by finding one recurring expense to cut — even $100/month less spending makes a real difference.`
}

export default function MakeMeSafer({ profile, activeScenarios }) {
  const [result, setResult]   = useState(null)
  const [verdict, setVerdict] = useState(null)
  const [loading, setLoading] = useState(false)
  const [ran, setRan]         = useState(false)

  async function handleCalculate() {
    setLoading(true)
    setVerdict(null)
    setRan(true)

    // Works with zero active scenarios — uses profile only
    const scenariosToUse = activeScenarios || []
    const calc = calcSavingsTarget(profile, scenariosToUse, 20)
    setResult(calc)

    const text = await fetchSaferVerdict({
      profile,
      riskPercent: calc.current.riskPercent,
      survivalMonths: calc.current.survivalMonths,
      targetRisk: 20,
    })
    setVerdict(text || buildSaferFallback(calc.gap, calc.target, calc.current.riskPercent))
    setLoading(false)
  }

  const currentSavings = Number(profile?.savings) || 0
  const progress       = result ? Math.min(100, Math.round((currentSavings / result.target) * 100)) : 0
  const currentTheme   = result ? getRiskTheme(result.current.riskPercent) : getRiskTheme(0)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

      {/* Current position */}
      <div style={{ background: '#fff', border: `0.5px solid ${C.border}`, borderRadius: 16, padding: 22 }}>
        <p style={{ margin: '0 0 16px', fontSize: 13, fontWeight: 700, color: navy }}>Your current position</p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>

          <div style={{ background: currentTheme.bg, border: `0.5px solid ${currentTheme.border}`, borderRadius: 12, padding: 16 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
              <p style={{ margin: 0, fontSize: 11, fontWeight: 700, color: currentTheme.label, textTransform: 'uppercase', letterSpacing: '.06em' }}>Current risk</p>
              <InfoButton text="If you lost your job tomorrow, this is the chance you'd run out of money before getting back on your feet." />
            </div>
            <p style={{ margin: 0, fontSize: 36, fontWeight: 700, color: currentTheme.value, fontFamily: "'DM Mono', monospace", lineHeight: 1 }}>
              {result ? result.current.riskPercent : '—'}%
            </p>
          </div>

          <div style={{ background: currentTheme.bg, border: `0.5px solid ${currentTheme.border}`, borderRadius: 12, padding: 16 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
              <p style={{ margin: 0, fontSize: 11, fontWeight: 700, color: currentTheme.label, textTransform: 'uppercase', letterSpacing: '.06em' }}>Months safe</p>
              <InfoButton text="If everything went wrong today, this is how long you could pay your bills before your savings hit zero." />
            </div>
            <p style={{ margin: 0, fontSize: 36, fontWeight: 700, color: currentTheme.value, fontFamily: "'DM Mono', monospace", lineHeight: 1 }}>
              {result ? Number(result.current.survivalMonths).toFixed(1) : '—'}
            </p>
          </div>

          <div style={{ background: '#f3f5fa', border: `0.5px solid ${C.border}`, borderRadius: 12, padding: 16 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
              <p style={{ margin: 0, fontSize: 11, fontWeight: 700, color: navy, textTransform: 'uppercase', letterSpacing: '.06em', opacity: .5 }}>Current savings</p>
              <InfoButton text="The total amount sitting in your savings account right now." />
            </div>
            <p style={{ margin: 0, fontSize: 36, fontWeight: 700, color: navy, fontFamily: "'DM Mono', monospace", lineHeight: 1 }}>
              ${currentSavings >= 1000 ? `${(currentSavings / 1000).toFixed(0)}k` : currentSavings.toLocaleString()}
            </p>
          </div>

        </div>

        {/* Calculate button */}
        <button
          onClick={handleCalculate}
          disabled={loading}
          style={{
            width: '100%', marginTop: 16, padding: '14px 0',
            borderRadius: 100, fontSize: 15, fontWeight: 700,
            fontFamily: 'inherit', cursor: loading ? 'not-allowed' : 'pointer',
            background: navy, color: '#fff', border: 'none',
            opacity: loading ? 0.7 : 1, transition: 'all .2s',
            boxShadow: '0 4px 16px rgba(19,25,54,.2)',
          }}
        >
          {loading ? '⏳ Calculating...' : ran ? '↻ Recalculate' : 'Calculate my safety target'}
        </button>
      </div>

      {/* Savings target + progress */}
      {result && (
        <>
          <div style={{ background: '#fff', border: `0.5px solid ${C.border}`, borderRadius: 16, padding: 24 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 4 }}>
              <p style={{ margin: 0, fontSize: 13, fontWeight: 700, color: navy }}>
                What you need to get below 20% risk
              </p>
              <InfoButton text="We keep adding $500 to your savings in the simulation until your risk drops below 20%. This is that number." />
            </div>
            <p style={{ margin: '0 0 16px', fontSize: 13, color: navy, opacity: .5 }}>
              Based on your {activeScenarios.length > 0 ? 'active scenarios' : 'current profile'}
            </p>

            {result.gap === 0 ? (
              <div style={{ background: '#f0fdf4', border: '0.5px solid #bbf7d0', borderRadius: 12, padding: 16 }}>
                <p style={{ margin: 0, fontSize: 16, fontWeight: 700, color: '#15803d' }}>
                  You're already below 20% risk! 🎉
                </p>
                <p style={{ margin: '6px 0 0', fontSize: 13, color: '#166534' }}>
                  Your current savings are enough to keep you safe under these scenarios.
                </p>
              </div>
            ) : (
              <>
                <div style={{ fontSize: 56, fontWeight: 700, color: navy, fontFamily: "'DM Mono', monospace", lineHeight: 1, marginBottom: 6 }}>
                  ${result.target.toLocaleString()}
                </div>
                <p style={{ margin: '0 0 20px', fontSize: 14, color: navy, opacity: .6 }}>
                  You have ${currentSavings.toLocaleString()} — you need{' '}
                  <strong style={{ color: navy, opacity: 1 }}>${result.gap.toLocaleString()} more</strong>
                </p>

                {/* Progress bar */}
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, fontWeight: 700, color: navy, marginBottom: 8 }}>
                  <span>Now: ${currentSavings.toLocaleString()}</span>
                  <span style={{ color: '#15803d' }}>Target: ${result.target.toLocaleString()}</span>
                </div>
                <div style={{ background: '#f0fdf4', borderRadius: 4, height: 16, overflow: 'hidden', border: '0.5px solid #bbf7d0' }}>
                  <div style={{
                    width: `${progress}%`, height: '100%',
                    background: '#15803d', borderRadius: 4,
                    transition: 'width 0.8s cubic-bezier(.4,0,.2,1)',
                  }} />
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 8 }}>
                  <span style={{ fontSize: 12, color: navy, opacity: .4 }}>0</span>
                  <span style={{ fontSize: 12, fontWeight: 700, color: '#15803d' }}>{progress}% of the way there</span>
                </div>
              </>
            )}
          </div>

          {/* Claude action plan */}
          <div style={{
            background: '#fff', border: `0.5px solid ${C.border}`,
            borderLeft: '3.5px solid #15803d',
            borderRadius: 12, padding: '20px 22px',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#15803d', flexShrink: 0 }} />
              <span style={{ fontSize: 11, fontWeight: 700, color: navy, textTransform: 'uppercase', letterSpacing: '.06em' }}>
                Your action plan
              </span>
            </div>
            {loading ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <LoadingDots />
                <span style={{ fontSize: 14, color: C.text3 }}>Building your plan...</span>
              </div>
            ) : (
              <p style={{ margin: 0, fontSize: 15, color: navy, lineHeight: 1.8 }}>{verdict}</p>
            )}
          </div>
        </>
      )}

      {/* Empty state */}
      {!ran && (
        <div style={{
          display: 'flex', flexDirection: 'column', alignItems: 'center',
          justifyContent: 'center', minHeight: 180, gap: 12, textAlign: 'center',
          background: '#fff', border: `0.5px solid ${C.border}`, borderRadius: 16, padding: 32,
        }}>
          <p style={{ fontSize: 16, fontWeight: 700, color: navy, margin: 0 }}>See what it takes to be safe</p>
          <p style={{ fontSize: 13, color: C.text3, margin: 0, maxWidth: 280, lineHeight: 1.6 }}>
            Hit the button above and we'll calculate exactly how much you need to save to get your risk below 20%.
          </p>
        </div>
      )}
    </div>
  )
}

function LoadingDots() {
  return (
    <div style={{ display: 'flex', gap: 4 }}>
      {[0, 1, 2].map(i => (
        <div key={i} style={{
          width: 6, height: 6, borderRadius: '50%', background: '#15803d',
          animation: `dotBounce 1.2s ease-in-out ${i * 0.2}s infinite`,
        }} />
      ))}
      <style>{`@keyframes dotBounce{0%,80%,100%{transform:scale(.6);opacity:.4}40%{transform:scale(1);opacity:1}}`}</style>
    </div>
  )
}
