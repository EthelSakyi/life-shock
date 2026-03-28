import React, { useState, useRef, useEffect } from 'react'
import RiskGauge   from './RiskGauge'
import StatCards   from './StatCards'
import VerdictCard from './VerdictCard'
import MakeMeSafer from '../decision/MakeMeSafer'

const navy = '#131936'

export default function ResultsDashboard({
  results, activeScenarios, profile,
  verdict, verdictLoading, verdictError, hasRun
}) {
  const [showMakeSafer, setShowMakeSafer] = useState(false)
  const [autoRun, setAutoRun]             = useState(false)
  const makeSaferRef = useRef(null)

  // Auto-scroll to Make me safer when it opens
  useEffect(() => {
    if (showMakeSafer && makeSaferRef.current) {
      setTimeout(() => {
        makeSaferRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }, 100)
    }
  }, [showMakeSafer])

  // Reset when new run happens
  useEffect(() => {
    setShowMakeSafer(false)
    setAutoRun(false)
  }, [results])

  function handleImprove() {
    setShowMakeSafer(true)
    setAutoRun(true)
  }

  if (!hasRun || !results) {
    return (
      <div style={{
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        height: '100%', minHeight: 400, gap: 16, textAlign: 'center',
      }}>
        <div style={{ fontSize: 48 }}>📊</div>
        <p style={{ fontSize: 18, fontWeight: 700, color: navy, margin: 0 }}>
          Ready when you are
        </p>
        <p style={{ fontSize: 14, color: '#8591b4', margin: 0, maxWidth: 280, lineHeight: 1.6 }}>
          Select your scenarios on the left, then hit <strong style={{ color: navy }}>Run simulation</strong> to see your results.
        </p>
      </div>
    )
  }

  const riskPercent    = results?.riskPercent    ?? 0
  const survivalMonths = results?.survivalMonths ?? 0
  const baseGap        = (Number(profile?.income) || 0) - (Number(profile?.expenses) || 0)
  const shockExpenses  = (activeScenarios || []).reduce((sum, s) => {
    if (s.id === 'rate_increase' && s.increaseAmount) return sum + Number(s.increaseAmount)
    if (s.id === 'new_baby') return sum + 1200
    return sum
  }, 0)
  const monthlyGap = baseGap - shockExpenses

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <RiskGauge riskPercent={riskPercent} />
      <StatCards
        riskPercent={riskPercent}
        survivalMonths={survivalMonths}
        monthlyGap={monthlyGap}
      />
      <VerdictCard
        riskPercent={riskPercent}
        verdict={verdict}
        loading={verdictLoading}
        error={verdictError}
      />

      {/* How do I improve this — only when risk > 20% and scenarios active */}
      {riskPercent > 20 && (activeScenarios || []).length > 0 && !showMakeSafer && (
        <button
          onClick={handleImprove}
          style={{
            width: '100%', padding: '14px 0',
            borderRadius: 100, fontSize: 14, fontWeight: 700,
            fontFamily: 'inherit', cursor: 'pointer',
            background: 'transparent',
            border: `2px solid ${navy}`,
            color: navy, transition: 'all .2s',
          }}
        >
          How do I improve this? →
        </button>
      )}

      {/* Make me safer — auto-runs, auto-scrolls */}
      {showMakeSafer && (
        <div ref={makeSaferRef}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
            <p style={{ margin: 0, fontSize: 13, fontWeight: 700, color: '#8591b4', textTransform: 'uppercase', letterSpacing: '.06em' }}>
              Make me safer
            </p>
            <button
              onClick={() => { setShowMakeSafer(false); setAutoRun(false) }}
              style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: 600, color: '#8591b4' }}
            >✕ Close</button>
          </div>
          <MakeMeSafer
            profile={profile}
            activeScenarios={activeScenarios}
            currentRiskPercent={riskPercent}
            currentSurvivalMonths={survivalMonths}
            autoRun={autoRun}
          />
        </div>
      )}
    </div>
  )
}
