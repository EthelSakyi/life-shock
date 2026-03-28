import React from 'react'
import RiskGauge  from './RiskGauge'
import StatCards  from './StatCards'
import VerdictCard from './VerdictCard'

export default function ResultsDashboard({ results, activeScenarios, profile, verdict, verdictLoading, verdictError }) {
  const riskPercent   = results?.riskPercent    ?? 0
  const survivalMonths = results?.survivalMonths ?? 0

  // Monthly gap = income - expenses - any monthly shocks from active scenarios
  const baseGap = (Number(profile?.income) || 0) - (Number(profile?.expenses) || 0)
  const shockExpenses = activeScenarios.reduce((sum, s) => {
    if (s.id === 'rate_increase' && s.increaseAmount)  return sum + Number(s.increaseAmount)
    if (s.id === 'new_baby')                            return sum + 1200
    return sum
  }, 0)
  const monthlyGap = baseGap - shockExpenses

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

      {/* Gauge */}
      <RiskGauge riskPercent={riskPercent} />

      {/* 3 stat cards */}
      <StatCards
        riskPercent={riskPercent}
        survivalMonths={survivalMonths}
        monthlyGap={monthlyGap}
      />

      {/* Verdict */}
      <VerdictCard
        riskPercent={riskPercent}
        verdict={verdict}
        loading={verdictLoading}
        error={verdictError}
      />

    </div>
  )
}
