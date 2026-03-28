import React from 'react'
import RiskGauge from './RiskGauge'
import SurvivalCard from './SurvivalCard'
import SavingsChart from './SavingsChart'

export default function ResultsDashboard({ results, activeScenarios }) {
  const fakeData = Array.from({ length: 12 }).map((_, i) => ({
    month: i + 1,
    value: 5000 - i * 400,
  }))

  return (
    <div style={wrapper}>
      <div style={topRow}>
        <RiskGauge riskPercent={results?.riskPercent || 0} />
        <SurvivalCard months={results?.survivalMonths || 0} />

        <div style={smallCard}>
          <div>SCENARIOS</div>
          <div style={{ fontSize: 28 }}>{activeScenarios.length}</div>
        </div>
      </div>

      <SavingsChart data={fakeData} />
    </div>
  )
}

const wrapper = {
  display: 'flex',
  flexDirection: 'column',
  gap: 20,
}

const topRow = {
  display: 'grid',
  gridTemplateColumns: '1.5fr 1fr 1fr',
  gap: 16,
}

const smallCard = {
  background: '#0f172a',
  color: '#fff',
  padding: 20,
  borderRadius: 20,
}