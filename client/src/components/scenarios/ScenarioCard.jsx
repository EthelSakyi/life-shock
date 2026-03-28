import React, { useEffect, useState } from 'react'

const C = {
  bg: '#FFFFFF',
  bgHover: '#FBFCFF',
  bgActive: '#F7F9FF',
  border: 'rgba(17,28,68,0.08)',
  borderHover: 'rgba(17,28,68,0.14)',
  borderActive: '#7b93ff',
  text: '#111C44',
  text2: '#4B587C',
  text3: '#8591B4',
  accent: '#7b93ff',
  navy: '#131936',
  accentSoft: 'rgba(123,147,255,0.10)',
  navySoft: 'rgba(19,25,54,0.05)',
  inputBg: '#FFFFFF',
  inputBorder: 'rgba(17,28,68,0.10)',
  divider: 'rgba(17,28,68,0.06)',
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

  // IMPORTANT: no defaults here
  const currentVal =
    activeData && ctrl.field ? activeData[ctrl.field] : null

  const [localValue, setLocalValue] = useState('')

  // Sync when state changes
  useEffect(() => {
    if (currentVal === null || currentVal === undefined) {
      setLocalValue('')
    } else {
      setLocalValue(String(currentVal))
    }
  }, [currentVal, isActive])

  function handleInputChange(e) {
    e.stopPropagation()
    setLocalValue(e.target.value) // allow ANY typing
  }

  function handleBlur(e) {
    e.stopPropagation()

    if (localValue === '') {
      onParamChange(scenario.id, ctrl.field, null)
      return
    }

    const val = Number(localValue)

    if (Number.isNaN(val)) {
      setLocalValue('')
      onParamChange(scenario.id, ctrl.field, null)
      return
    }

    // NO CLAMPING. NO DEFAULTS.
    onParamChange(scenario.id, ctrl.field, val)
  }

  function getDisplayValue() {
    if (!localValue) return 'Not set'
    const num = Number(localValue)
    if (Number.isNaN(num)) return 'Not set'
    return ctrl.format ? ctrl.format(num) : localValue
  }

  return (
    <div
      onClick={() => onToggle(scenario.id)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        borderRadius: 22,
        border: `1px solid ${
          isActive ? C.borderActive : hovered ? C.borderHover : C.border
        }`,
        background: isActive ? C.bgActive : hovered ? C.bgHover : C.bg,
        boxShadow: isActive
          ? '0 10px 26px rgba(123,147,255,0.12)'
          : '0 4px 14px rgba(17,28,68,0.03)',
        transition: 'all 0.16s ease',
        overflow: 'hidden',
        cursor: 'pointer',
      }}
    >
      {/* HEADER */}
      <div
        style={{
          padding: '16px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <div style={{ display: 'flex', gap: 14, alignItems: 'center' }}>
          <div
            style={{
              width: 40,
              height: 40,
              borderRadius: 12,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: isActive ? C.accentSoft : C.navySoft,
            }}
          >
            <Icon
              size={18}
              strokeWidth={1.9}
              color={isActive ? C.accent : C.text3}
            />
          </div>

          <div>
            <div
              style={{
                fontSize: 15,
                fontWeight: 800,
                color: C.text,
              }}
            >
              {scenario.label}
            </div>

            <div
              style={{
                fontSize: 12.5,
                color: C.text3,
              }}
            >
              {scenario.description}
            </div>
          </div>
        </div>

        {/* SELECT CIRCLE */}
        <div
          style={{
            width: 22,
            height: 22,
            borderRadius: '50%',
            border: `1.5px solid ${
              isActive ? C.navy : 'rgba(17,28,68,0.18)'
            }`,
            background: isActive ? C.navy : 'transparent',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {isActive && (
            <div
              style={{
                width: 7,
                height: 7,
                borderRadius: '50%',
                background: '#fff',
              }}
            />
          )}
        </div>
      </div>

      {/* INPUT AREA */}
      {isActive && ctrl.type !== 'toggle' && (
        <div
          onClick={(e) => e.stopPropagation()}
          style={{ padding: '0 16px 16px' }}
        >
          <div
            style={{
              borderTop: `1px solid ${C.divider}`,
              paddingTop: 12,
              display: 'flex',
              justifyContent: 'space-between',
            }}
          >
            <div>
              <div
                style={{
                  fontSize: 11,
                  fontWeight: 800,
                  color: C.text3,
                  textTransform: 'uppercase',
                  marginBottom: 4,
                }}
              >
                {ctrl.label}
              </div>

              <div
                style={{
                  fontSize: 12,
                  color: C.text2,
                }}
              >
                {getDisplayValue()}
              </div>
            </div>

            <div
              style={{
                height: 42,
                display: 'flex',
                alignItems: 'center',
                borderRadius: 12,
                border: `1px solid ${C.inputBorder}`,
                overflow: 'hidden',
                background: C.inputBg,
              }}
            >
              {ctrl.prefix && (
                <div
                  style={{
                    padding: '0 10px',
                    borderRight: `1px solid ${C.inputBorder}`,
                    color: C.text3,
                  }}
                >
                  {ctrl.prefix}
                </div>
              )}

              <input
                type="number"
                value={localValue}
                onChange={handleInputChange}
                onBlur={handleBlur}
                onClick={(e) => e.stopPropagation()}
                style={{
                  width: 70,
                  border: 'none',
                  outline: 'none',
                  textAlign: 'center',
                  fontWeight: 800,
                  fontSize: 15,
                  background: 'transparent',
                  color: C.navy,
                }}
              />

              {ctrl.suffix && (
                <div
                  style={{
                    padding: '0 10px',
                    borderLeft: `1px solid ${C.inputBorder}`,
                    color: C.text3,
                  }}
                >
                  {ctrl.suffix}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* BABY TEXT */}
      {isActive && ctrl.type === 'toggle' && (
        <div style={{ padding: '0 16px 16px', fontSize: 12.5, color: C.text2 }}>
          Estimates <strong>$1,200/month</strong> and{' '}
          <strong>3 months</strong> parental leave.
        </div>
      )}
    </div>
  )
}