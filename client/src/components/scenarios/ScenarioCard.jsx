import React, { useEffect, useState } from 'react'

const C = {
  bg: '#FFFFFF',
  bgHover: '#FBFCFF',
  bgActive: '#F7F9FF',
  border: 'rgba(17,28,68,0.08)',
  borderHover: 'rgba(17,28,68,0.14)',
  borderActive: 'rgba(111,134,255,0.42)',
  text: '#111C44',
  text2: '#4B587C',
  text3: '#8591B4',
  accent: '#6F86FF',
  navy: '#121D49',
  accentSoft: 'rgba(111,134,255,0.10)',
  navySoft: 'rgba(18,29,73,0.05)',
  inputBg: '#FFFFFF',
  inputBorder: 'rgba(17,28,68,0.10)',
  divider: 'rgba(17,28,68,0.06)',
}

function clampValue(value, min, max) {
  if (Number.isNaN(value)) return min ?? 0
  if (typeof min === 'number' && value < min) return min
  if (typeof max === 'number' && value > max) return max
  return value
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

  const currentVal =
    activeData && ctrl.field ? activeData[ctrl.field] : null

  const [localValue, setLocalValue] = useState(
    currentVal !== undefined && currentVal !== null ? String(currentVal) : ''
  )

  useEffect(() => {
    setLocalValue(
      currentVal !== undefined && currentVal !== null ? String(currentVal) : ''
    )
  }, [currentVal, isActive])

  function handleInputChange(e) {
    e.stopPropagation()
    setLocalValue(e.target.value)
  }

  function handleBlur(e) {
    e.stopPropagation()

    if (localValue === '') {
      onParamChange(scenario.id, ctrl.field, null)
      return
    }

    let val = Number(localValue)

    if (Number.isNaN(val)) {
      onParamChange(scenario.id, ctrl.field, null)
      setLocalValue('')
      return
    }

    val = clampValue(val, ctrl.min, ctrl.max)
    setLocalValue(String(val))
    onParamChange(scenario.id, ctrl.field, val)
  }

  function getDisplayValue() {
    if (localValue === '' || localValue === null || localValue === undefined) {
      return 'Not set'
    }

    const numeric = Number(localValue)
    if (Number.isNaN(numeric)) return 'Not set'

    return ctrl.format ? ctrl.format(numeric) : localValue
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
          ? '0 10px 26px rgba(111,134,255,0.08)'
          : '0 4px 14px rgba(17,28,68,0.03)',
        transition: 'all 0.16s ease',
        overflow: 'hidden',
        cursor: 'pointer',
      }}
    >
      <div
        style={{
          padding: '16px 16px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 14,
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 14,
            flex: 1,
            minWidth: 0,
          }}
        >
          <div
            style={{
              width: 40,
              height: 40,
              borderRadius: 12,
              flexShrink: 0,
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

          <div style={{ minWidth: 0 }}>
            <div
              style={{
                fontSize: 15,
                fontWeight: 800,
                letterSpacing: '-0.02em',
                color: C.text,
                marginBottom: 3,
              }}
            >
              {scenario.label}
            </div>

            <div
              style={{
                fontSize: 12.5,
                lineHeight: 1.45,
                color: C.text3,
              }}
            >
              {scenario.description}
            </div>
          </div>
        </div>

        <div
          style={{
            width: 22,
            height: 22,
            borderRadius: 999,
            flexShrink: 0,
            border: `1.5px solid ${isActive ? C.navy : 'rgba(17,28,68,0.18)'}`,
            background: isActive ? C.navy : 'transparent',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all 0.16s ease',
          }}
        >
          {isActive && (
            <div
              style={{
                width: 7,
                height: 7,
                borderRadius: '50%',
                background: '#FFFFFF',
              }}
            />
          )}
        </div>
      </div>

      {isActive && ctrl.type !== 'toggle' && (
        <div
          onClick={(e) => e.stopPropagation()}
          style={{
            padding: '0 16px 16px',
          }}
        >
          <div
            style={{
              borderTop: `1px solid ${C.divider}`,
              paddingTop: 13,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 12,
            }}
          >
            <div style={{ minWidth: 0 }}>
              <div
                style={{
                  fontSize: 11,
                  fontWeight: 800,
                  textTransform: 'uppercase',
                  letterSpacing: '0.10em',
                  color: C.text3,
                  marginBottom: 5,
                }}
              >
                {ctrl.label}
              </div>

              <div
                style={{
                  fontSize: 12,
                  color: C.text2,
                  fontWeight: 600,
                }}
              >
                {getDisplayValue()}
              </div>
            </div>

            <div
              style={{
                height: 42,
                minWidth: 122,
                display: 'flex',
                alignItems: 'center',
                background: C.inputBg,
                border: `1px solid ${C.inputBorder}`,
                borderRadius: 12,
                overflow: 'hidden',
                flexShrink: 0,
                boxShadow: '0 2px 8px rgba(17,28,68,0.03)',
              }}
            >
              {ctrl.prefix && (
                <div
                  style={{
                    padding: '0 12px',
                    height: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    borderRight: `1px solid ${C.inputBorder}`,
                    background: '#F8FAFF',
                    color: C.text3,
                    fontSize: 13,
                    fontWeight: 700,
                  }}
                >
                  {ctrl.prefix}
                </div>
              )}

              <input
                type="number"
                value={localValue}
                min={ctrl.min}
                max={ctrl.max}
                onChange={handleInputChange}
                onBlur={handleBlur}
                onClick={(e) => e.stopPropagation()}
                placeholder=""
                style={{
                  width: 74,
                  height: '100%',
                  border: 'none',
                  outline: 'none',
                  background: 'transparent',
                  color: C.navy,
                  fontSize: 15,
                  fontWeight: 800,
                  textAlign: 'center',
                  fontFamily: 'inherit',
                  appearance: 'textfield',
                  MozAppearance: 'textfield',
                }}
              />

              {ctrl.suffix && (
                <div
                  style={{
                    padding: '0 12px',
                    height: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    borderLeft: `1px solid ${C.inputBorder}`,
                    background: '#F8FAFF',
                    color: C.text3,
                    fontSize: 12,
                    fontWeight: 700,
                  }}
                >
                  {ctrl.suffix}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {isActive && ctrl.type === 'toggle' && (
        <div
          style={{
            padding: '0 16px 16px',
          }}
        >
          <div
            style={{
              borderTop: `1px solid ${C.divider}`,
              paddingTop: 13,
              fontSize: 12.5,
              lineHeight: 1.55,
              color: C.text2,
            }}
          >
            Estimates <strong>$1,200/month</strong> in added costs and
            <strong> 3 months</strong> of parental leave.
          </div>
        </div>
      )}
    </div>
  )
}