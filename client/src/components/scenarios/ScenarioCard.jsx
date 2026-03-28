// client/src/components/scenarios/ScenarioCard.jsx
import React, { useState } from 'react'

const C = {
  bg:           '#ffffff',
  bgHov:        '#f8f9ff',
  bgActive:     '#f0f2ff',
  border:       'rgba(19,25,54,.08)',
  borderHov:    'rgba(19,25,54,.18)',
  borderActive: '#7b93ff',
  text:         '#0f1235',
  text2:        '#4a5080',
  text3:        '#8b91b8',
  navy:         '#131936',
  accent:       '#7b93ff',
  accentLt:     'rgba(123,147,255,.12)',
  inputBg:      '#f3f4f8',
  inputBorder:  'rgba(19,25,54,.1)',
}

export default function ScenarioCard({
  scenario,
  isActive,
  activeData,
  onToggle,
  onParamChange,
}) {
  const [hovered, setHovered] = useState(false)
  const ctrl = scenario.control
  const Icon = scenario.icon

  const currentVal = activeData && ctrl.field
    ? activeData[ctrl.field] ?? ctrl.default
    : ctrl.default

  function handleInputChange(e) {
    e.stopPropagation()
    const val = Number(e.target.value)
    if (!isNaN(val)) onParamChange(scenario.id, ctrl.field, val)
  }

  return (
    <div
      onClick={() => onToggle(scenario.id)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: isActive ? C.bgActive : hovered ? C.bgHov : C.bg,
        border: `1.5px solid ${
          isActive ? C.borderActive
          : hovered ? C.borderHov
          : C.border
        }`,
        borderRadius: 12,
        padding: '16px 18px',
        cursor: 'pointer',
        transition: 'all .15s ease',
        userSelect: 'none',
      }}
    >
      {/* Main row */}
      <div style={{
        display: 'flex', alignItems: 'center',
        justifyContent: 'space-between', gap: 14,
      }}>
        <div style={{
          display: 'flex', alignItems: 'center',
          gap: 14, flex: 1, minWidth: 0,
        }}>

          {/* Icon */}
          <div style={{
            width: 42, height: 42, borderRadius: 10, flexShrink: 0,
            background: isActive ? C.accentLt : 'rgba(19,25,54,.05)',
            display: 'flex', alignItems: 'center',
            justifyContent: 'center', transition: 'all .15s',
          }}>
            <Icon size={19} strokeWidth={1.7}
              color={isActive ? C.accent : C.text3} />
          </div>

          {/* Text */}
          <div style={{ minWidth: 0 }}>
            <div style={{
              fontSize: 15, fontWeight: 700,
              color: isActive ? C.navy : C.text,
              marginBottom: 2,
            }}>
              {scenario.label}
            </div>
            <div style={{
              fontSize: 12, color: C.text3,
              lineHeight: 1.4,
            }}>
              {scenario.description}
            </div>
          </div>
        </div>

        {/* Checkbox */}
        <div style={{
          width: 22, height: 22, borderRadius: 6, flexShrink: 0,
          border: `1.5px solid ${isActive ? C.accent : 'rgba(19,25,54,.2)'}`,
          background: isActive ? C.accent : 'transparent',
          display: 'flex', alignItems: 'center',
          justifyContent: 'center', transition: 'all .15s',
        }}>
          {isActive && (
            <svg width="12" height="10" viewBox="0 0 12 10" fill="none">
              <path d="M1 4.5L4.5 8L11 1" stroke="#fff"
                strokeWidth="1.8" strokeLinecap="round"
                strokeLinejoin="round" />
            </svg>
          )}
        </div>
      </div>

      {/* Input — shown when active */}
      {isActive && ctrl.type !== 'toggle' && (
        <div
          onClick={(e) => e.stopPropagation()}
          style={{
            marginTop: 14, padding: '12px 14px',
            background: '#fff',
            border: `1px solid ${C.inputBorder}`,
            borderRadius: 10,
          }}
        >
          <div style={{
            fontSize: 11, fontWeight: 600, color: C.text3,
            textTransform: 'uppercase', letterSpacing: '0.07em',
            marginBottom: 8,
          }}>
            {ctrl.label}
          </div>
          <div style={{
            display: 'flex', alignItems: 'center',
            background: C.inputBg,
            border: `1px solid ${C.inputBorder}`,
            borderRadius: 8, height: 44, overflow: 'hidden',
          }}>
            {ctrl.type === 'money' && (
              <div style={{
                padding: '0 14px', fontSize: 15, color: C.text3,
                borderRight: `1px solid ${C.inputBorder}`,
                height: '100%', display: 'flex',
                alignItems: 'center',
                background: 'rgba(19,25,54,.04)',
                fontWeight: 700, flexShrink: 0,
              }}>
                $
              </div>
            )}
            <input
              type="number"
              min={ctrl.min ?? 0}
              max={ctrl.max}
              value={currentVal ?? ctrl.default}
              onChange={handleInputChange}
              placeholder={ctrl.placeholder}
              style={{
                flex: 1, background: 'transparent',
                border: 'none', outline: 'none',
                padding: '0 14px', fontSize: 16,
                fontWeight: 700, color: C.navy,
                fontFamily: 'inherit', height: '100%',
              }}
            />
            {ctrl.suffix && (
              <div style={{
                padding: '0 14px', fontSize: 12,
                color: C.text3, flexShrink: 0,
                borderLeft: `1px solid ${C.inputBorder}`,
                height: '100%', display: 'flex',
                alignItems: 'center',
                background: 'rgba(19,25,54,.04)',
                fontWeight: 600,
              }}>
                {ctrl.suffix}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Toggle info — new baby */}
      {isActive && ctrl.type === 'toggle' && (
        <div style={{
          marginTop: 12, padding: '10px 12px',
          background: C.accentLt, borderRadius: 8,
          fontSize: 13, color: C.text2, lineHeight: 1.5,
        }}>
          Adds $1,200/month in expenses and models 3 months of parental leave.
        </div>
      )}
    </div>
  )
}