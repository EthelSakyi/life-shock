// client/src/components/scenarios/ActiveScenarioChips.jsx
import React from 'react'
import { SCENARIOS } from '../../data/scenarioConfig'

const C = {
  chipBg:     'rgba(19,25,54,.06)',
  chipBorder: 'rgba(19,25,54,.15)',
  navy:       '#131936',
  text2:      '#4a5080',
  text3:      '#8b91b8',
  accent:     '#7b93ff',
}

export default function ActiveScenarioChips({ activeScenarios, onRemove }) {
  if (!activeScenarios.length) return null

  return (
    <div style={{
      display: 'flex', flexWrap: 'wrap',
      gap: 8, marginBottom: 16,
    }}>
      {activeScenarios.map((active) => {
        const config = SCENARIOS.find((s) => s.id === active.id)
        if (!config) return null

        const Icon = config.icon
        const ctrl = config.control
        const val = ctrl.field ? active[ctrl.field] : null
        const valLabel = val !== null && val !== undefined && ctrl.format
          ? ctrl.format(val)
          : null

        return (
          <div key={active.id} style={{
            display: 'flex', alignItems: 'center', gap: 6,
            background: C.chipBg,
            border: `1px solid ${C.chipBorder}`,
            borderRadius: 100, padding: '5px 10px 5px 8px',
          }}>
            <Icon size={12} strokeWidth={2} color={C.accent} />
            <span style={{
              fontSize: 12, fontWeight: 600, color: C.navy,
            }}>
              {config.shortLabel}
            </span>
            {valLabel && (
              <span style={{
                fontSize: 11, color: C.text3,
                fontFamily: "'DM Mono', monospace",
              }}>
                {valLabel}
              </span>
            )}
            <button
              onClick={() => onRemove(active.id)}
              onMouseEnter={(e) => e.currentTarget.style.color = C.navy}
              onMouseLeave={(e) => e.currentTarget.style.color = C.text3}
              style={{
                background: 'none', border: 'none',
                cursor: 'pointer', color: C.text3,
                padding: '0 0 0 2px', fontSize: 15,
                lineHeight: 1, display: 'flex',
                alignItems: 'center', transition: 'color .15s',
              }}
            >
              ×
            </button>
          </div>
        )
      })}
    </div>
  )
}