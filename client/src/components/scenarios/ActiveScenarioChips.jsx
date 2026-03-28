import React from 'react'
import { SCENARIOS } from '../../data/scenarioConfig'

const C = {
  chipBg: '#F7F9FF',
  chipBorder: 'rgba(17,28,68,0.08)',
  text2: '#8591B4',
  accent: '#6F86FF',
}

export default function ActiveScenarioChips({ activeScenarios, onRemove }) {
  if (!activeScenarios.length) return null

  return (
    <div
      style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: 8,
        marginBottom: 14,
      }}
    >
      {activeScenarios.map((active) => {
        const config = SCENARIOS.find((s) => s.id === active.id)
        if (!config) return null

        const Icon = config.icon
        const ctrl = config.control
        const val = ctrl.field ? active[ctrl.field] : null

        let valLabel = null
        if (val !== null && val !== undefined && val !== '' && ctrl.format) {
          valLabel = ctrl.format(val)
        }

        return (
          <div
            key={active.id}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              padding: '7px 10px',
              borderRadius: 999,
              background: C.chipBg,
              border: `1px solid ${C.chipBorder}`,
            }}
          >
            <Icon size={14} strokeWidth={1.9} color={C.accent} />

            {valLabel ? (
              <span
                style={{
                  fontSize: 12,
                  fontWeight: 700,
                  color: C.text2,
                }}
              >
                {valLabel}
              </span>
            ) : (
              <span
                style={{
                  fontSize: 12,
                  fontWeight: 700,
                  color: C.text2,
                }}
              >
                On
              </span>
            )}

            <button
              onClick={() => onRemove(active.id)}
              style={{
                border: 'none',
                background: 'transparent',
                color: C.text2,
                cursor: 'pointer',
                fontSize: 15,
                lineHeight: 1,
                padding: 0,
                marginLeft: 2,
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