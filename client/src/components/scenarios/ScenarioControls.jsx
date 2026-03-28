// client/src/components/scenarios/ScenarioControls.jsx
import React from 'react'
import { SCENARIOS } from '../../data/scenarioConfig'
import ScenarioCard from './ScenarioCard'
import ActiveScenarioChips from './ActiveScenarioChips'

const C = {
  text:   '#0f1235',
  text2:  '#4a5080',
  text3:  '#8b91b8',
  border: 'rgba(19,25,54,.08)',
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
      {/* Header */}
      <div style={{ marginBottom: 20 }}>
        <div style={{
          fontSize: 11, fontWeight: 700, color: C.text3,
          textTransform: 'uppercase', letterSpacing: '0.08em',
          marginBottom: 6,
        }}>
          Scenario simulator
        </div>
        <h2 style={{
          fontSize: 24, fontWeight: 800, color: C.text,
          letterSpacing: '-0.5px', margin: 0,
        }}>
          What happened?
        </h2>
        <p style={{
          fontSize: 14, color: C.text3,
          margin: '6px 0 0', lineHeight: 1.5,
        }}>
          Select one or more life events. Results update instantly.
        </p>
      </div>

      {/* Active chips */}
      <ActiveScenarioChips
        activeScenarios={activeScenarios}
        onRemove={onRemove}
      />

      {/* Divider */}
      <div style={{ height: 1, background: C.border, marginBottom: 12 }} />

      {/* Cards — full width, generous sizing */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
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
        <div style={{
          marginTop: 16, padding: '14px',
          borderRadius: 10, textAlign: 'center',
          background: 'rgba(123,147,255,.04)',
          border: '1px dashed rgba(19,25,54,.08)',
        }}>
          <p style={{ fontSize: 13, color: C.text3, margin: 0 }}>
            Select a scenario to see your risk
          </p>
        </div>
      )}
    </div>
  )
}