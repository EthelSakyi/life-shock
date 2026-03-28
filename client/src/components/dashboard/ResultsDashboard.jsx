import React from 'react'
import RiskGauge  from './RiskGauge'
import StatCards  from './StatCards'
import VerdictCard from './VerdictCard'

export default function ResultsDashboard({ results, activeScenarios, profile, verdict, verdictLoading, verdictError, hasRun }) {

  // Before first run — show waiting state
  if (!hasRun || !results) {
    return (
      <div style={{
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        height: '100%', minHeight: 400, gap: 16, textAlign: 'center',
      }}>
        <div style={{ fontSize: 48 }}>📊</div>
        <p style={{ fontSize: 18, fontWeight: 700, color: '#131936', margin: 0 }}>
          Ready when you are
        </p>
        <p style={{ fontSize: 14, color: '#8591b4', margin: 0, maxWidth: 280, lineHeight: 1.6 }}>
          Select your scenarios on the left, then hit <strong style={{ color: '#131936' }}>Run simulation</strong> to see your results.
        </p>
      </div>
    )
  }

  const riskPercent    = results?.riskPercent    ?? 0
  const survivalMonths = results?.survivalMonths ?? 0

  const baseGap = (Number(profile?.income) || 0) - (Number(profile?.expenses) || 0)
  const shockExpenses = activeScenarios.reduce((sum, s) => {
    if (s.id === 'rate_increase' && s.increaseAmount) return sum + Number(s.increaseAmount)
    if (s.id === 'new_baby')                          return sum + 1200
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
    </div>
  )
}
