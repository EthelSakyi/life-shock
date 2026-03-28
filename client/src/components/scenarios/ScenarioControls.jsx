import React from 'react'
import { SCENARIOS } from '../../data/scenarioConfig'
import ScenarioCard from './ScenarioCard'
import ActiveScenarioChips from './ActiveScenarioChips'

const C = {
  accent: '#6F86FF',
  text3: '#8591B4',
  border: 'rgba(17,28,68,0.08)',
  emptyBg: 'rgba(111,134,255,0.04)',
}

export default function ScenarioControls({
  activeScenarios,
  onToggle,
  onParamChange,
  onRemove,
  isActive,
}) {
  return (
    <div>
      <div style={{ marginBottom: 16 }}>
        <p
          style={{
            margin: 0,
            fontSize: 14,
            color: C.text3,
            lineHeight: 1.5,
          }}
        >
          Pick scenarios and adjust the values below.
        </p>
      </div>

      <ActiveScenarioChips
        activeScenarios={activeScenarios}
        onRemove={onRemove}
      />

      <div
        style={{
          height: 1,
          background: C.border,
          marginBottom: 14,
        }}
      />

      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 10,
        }}
      >
        {SCENARIOS.map((scenario) => (
          <ScenarioCard
            key={scenario.id}
            scenario={scenario}
            isActive={isActive(scenario.id)}
            activeData={activeScenarios.find((s) => s.id === scenario.id)}
            onToggle={onToggle}
            onParamChange={onParamChange}
          />
        ))}
      </div>

      {activeScenarios.length === 0 && (
        <div
          style={{
            marginTop: 14,
            padding: '14px 14px',
            borderRadius: 16,
            background: C.emptyBg,
            border: `1px dashed ${C.border}`,
          }}
        >
          <div
            style={{
              fontSize: 13,
              color: C.text3,
              lineHeight: 1.5,
            }}
          >
            Select a scenario to begin.
          </div>
        </div>
      )}
    </div>
  )
}