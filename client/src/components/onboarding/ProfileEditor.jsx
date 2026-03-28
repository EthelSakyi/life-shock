import React, { useState } from 'react'

const navy = '#131936'
const C = {
  bg: '#f8f9ff',
  surface: '#ffffff',
  border: 'rgba(19,25,54,.1)',
  border2: 'rgba(19,25,54,.18)',
  text2: '#4a5080',
  text3: '#8b91b8',
}

export default function ProfileEditor({ profile, onSave, onClose }) {
  const [form, setForm] = useState({ ...profile })

  function update(field, value) {
    setForm(prev => ({ ...prev, [field]: value }))
  }

  function handleSave() {
    onSave(form)
    onClose()
  }

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: 'fixed', inset: 0,
          background: 'rgba(19,25,54,.35)',
          backdropFilter: 'blur(4px)',
          WebkitBackdropFilter: 'blur(4px)',
          zIndex: 100,
        }}
      />

      {/* Modal */}
      <div style={{
        position: 'fixed', top: '50%', left: '50%',
        transform: 'translate(-50%, -50%)',
        background: C.surface,
        borderRadius: 20, padding: '36px 40px',
        width: '100%', maxWidth: 520,
        boxShadow: '0 24px 80px rgba(19,25,54,.2)',
        zIndex: 101, maxHeight: '90vh', overflowY: 'auto',
      }}>

        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28 }}>
          <div>
            <h2 style={{ margin: 0, fontSize: 22, fontWeight: 800, color: navy, letterSpacing: '-0.5px' }}>
              Edit your profile
            </h2>
            <p style={{ margin: '4px 0 0', fontSize: 13, color: C.text3 }}>
              Changes apply to all simulations immediately
            </p>
          </div>
          <button
            onClick={onClose}
            style={{
              width: 32, height: 32, borderRadius: '50%',
              background: 'rgba(19,25,54,.07)', border: 'none',
              cursor: 'pointer', fontSize: 16, color: C.text2,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontWeight: 700,
            }}
          >×</button>
        </div>

        {/* Name */}
        <Section label="First name">
          <TextInput value={form.name} onChange={v => update('name', v)} placeholder="Alex" />
        </Section>

        <Divider label="Income & expenses" />

        <Section label="Monthly take-home income" hint="All household income after tax">
          <MoneyInput value={form.income} onChange={v => update('income', v)} placeholder="4,300" suffix="/ mo" />
        </Section>

        <Section label="Monthly essential expenses" hint="Rent, groceries, bills, subscriptions">
          <MoneyInput value={form.expenses} onChange={v => update('expenses', v)} placeholder="3,200" suffix="/ mo" />
        </Section>

        <Divider label="Savings & debt" />

        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr) minmax(0,1fr)', gap: 14 }}>
          <Section label="Savings balance">
            <MoneyInput value={form.savings} onChange={v => update('savings', v)} placeholder="18,000" />
          </Section>
          <Section label={<>Monthly debt <Opt /></>}>
            <MoneyInput value={form.debt} onChange={v => update('debt', v)} placeholder="250" suffix="/ mo" />
          </Section>
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', gap: 10 }}>
          <button
            onClick={onClose}
            style={{
              flex: 1, padding: 14, borderRadius: 100,
              fontSize: 14, fontWeight: 600, fontFamily: 'inherit',
              cursor: 'pointer', background: 'transparent',
              border: `1.5px solid ${C.border2}`, color: C.text2,
              transition: 'all .15s',
            }}
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            style={{
              flex: 2, padding: 14, borderRadius: 100,
              fontSize: 14, fontWeight: 700, fontFamily: 'inherit',
              cursor: 'pointer', background: navy, color: '#fff',
              border: 'none', boxShadow: '0 2px 12px rgba(19,25,54,.2)',
              transition: 'all .15s',
            }}
          >
            Save changes
          </button>
        </div>
      </div>
    </>
  )
}

// ── Sub-components ─────────────────────────────────────────────────

function Section({ label, hint, children }) {
  return (
    <div style={{ marginBottom: 14 }}>
      <div style={{ fontSize: 13, fontWeight: 600, color: C.text2, marginBottom: hint ? 3 : 6, display: 'flex', gap: 6, alignItems: 'center' }}>
        {label}
      </div>
      {hint && <div style={{ fontSize: 11, color: C.text3, marginBottom: 5, lineHeight: 1.4 }}>{hint}</div>}
      {children}
    </div>
  )
}

function Divider({ label }) {
  return (
    <div style={{
      fontSize: 11, fontWeight: 700, color: C.text3,
      textTransform: 'uppercase', letterSpacing: '.08em',
      margin: '20px 0 14px', display: 'flex', alignItems: 'center', gap: 10,
    }}>
      {label}
      <div style={{ flex: 1, height: 1, background: C.border }} />
    </div>
  )
}

function TextInput({ value, onChange, placeholder }) {
  return (
    <div style={inputWrap}>
      <input
        type="text"
        value={value || ''}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        style={inputStyle}
      />
    </div>
  )
}

function MoneyInput({ value, onChange, placeholder, suffix }) {
  return (
    <div style={{ ...inputWrap, minWidth: 0 }}>
      <div style={prefixStyle}>$</div>
      <input
        type="number"
        min="0"
        value={value || ''}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        style={{ ...inputStyle, paddingLeft: 12 }}
      />
      {suffix && <div style={suffixStyle}>{suffix}</div>}
    </div>
  )
}

function Opt() {
  return (
    <span style={{
      fontSize: 10, fontWeight: 500, color: C.text3,
      background: '#f3f4f8', padding: '2px 8px',
    }}></span>
  )
}

const inputWrap = {
  display: 'flex', alignItems: 'center',
  background: '#f3f4f8', border: `1.5px solid ${C.border}`,
  borderRadius: 10, height: 46, overflow: 'hidden', width: '100%',
}

const inputStyle = {
  flex: 1, background: 'transparent', border: 'none', outline: 'none',
  padding: '0 14px', fontSize: 14, fontFamily: "'Plus Jakarta Sans', sans-serif",
  color: navy, height: '100%', fontWeight: 500,
}

const prefixStyle = {
  padding: '0 13px', fontSize: 14, color: C.text3,
  borderRight: `1px solid ${C.border}`, height: '100%',
  display: 'flex', alignItems: 'center',
  background: '#eef0f7', fontFamily: "'Plus Jakarta Sans', sans-serif",
  flexShrink: 0, fontWeight: 600,
}

const suffixStyle = {
  padding: '0 13px', fontSize: 12, color: C.text3,
  flexShrink: 0, fontFamily: "'Plus Jakarta Sans', sans-serif",
}
