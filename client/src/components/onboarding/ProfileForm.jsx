import React, { useState } from 'react';

const EMPLOYMENT_OPTIONS = [
  { value: 'employed',  label: 'Employed'  },
  { value: 'freelance', label: 'Freelance' },
  { value: 'student',   label: 'Student'   },
];

// ── Color tokens ──
const C = {
  bg:         '#f8f9ff',
  surface:    '#ffffff',
  surface2:   '#f3f4f8',
  border:     'rgba(19,25,54,.1)',
  border2:    'rgba(19,25,54,.18)',
  text:       '#0f1235',
  text2:      '#4a5080',
  text3:      '#8b91b8',
  navy:       '#131936',
  navyLt:     'rgba(19,25,54,.07)',
  navyMd:     'rgba(19,25,54,.18)',
  red:        '#dc2626',
};

export default function ProfileForm({ profile, onUpdate, onComplete, onUseDemo }) {
  const [step, setStep]     = useState(1);
  const [errors, setErrors] = useState({});

  function validateStep1() {
    const e = {};
    if (!profile.name?.trim()) e.name = 'Please enter your first name';
    return e;
  }

  function validateStep2() {
    const e = {};
    if (!profile.income   || Number(profile.income)   <= 0) e.income   = 'Please enter your monthly income';
    if (!profile.expenses || Number(profile.expenses) <= 0) e.expenses = 'Please enter your monthly expenses';
    if (profile.savings === '' || profile.savings === undefined || Number(profile.savings) < 0) e.savings = 'Please enter your savings balance';
    return e;
  }

  function handleNext() {
    const e = validateStep1();
    if (Object.keys(e).length) { setErrors(e); return; }
    setErrors({});
    setStep(2);
  }

  function handleSubmit() {
    const e = validateStep2();
    if (Object.keys(e).length) { setErrors(e); return; }
    setErrors({});
    onComplete();
  }

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center',
      justifyContent: 'center', padding: '52px 24px',
      background: C.bg,
    }}>
      <div style={card}>

        {/* Progress */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 32 }}>
          <div style={{ width: 32, height: 4, borderRadius: 2, background: step >= 1 ? C.navy : C.border, transition: 'background .3s' }} />
          <div style={{ width: 32, height: 4, borderRadius: 2, background: step >= 2 ? C.navy : C.border, transition: 'background .3s' }} />
          <span style={{ fontSize: 11, color: C.text3, marginLeft: 8, fontFamily: 'inherit', fontWeight: 500 }}>
            Step {step} of 2
          </span>
        </div>

        <h2 style={{ fontSize: 26, fontWeight: 800, color: C.text, letterSpacing: '-0.6px', marginBottom: 6 }}>
          {step === 1 ? "Let's get to know you" : 'Tell us about your finances'}
        </h2>
        <p style={{ fontSize: 14, color: C.text2, marginBottom: 32, lineHeight: 1.6 }}>
          {step === 1
            ? 'Takes under 60 seconds. Nothing leaves your device.'
            : 'The more accurate your numbers, the better your results.'}
        </p>

        {/* ── STEP 1 ── */}
        {step === 1 && (
          <>
            <Field label="First name" error={errors.name}>
              <TextInput
                value={profile.name}
                onChange={(v) => onUpdate({ name: v })}
                placeholder="Alex"
              />
            </Field>

            <Field label="Email address" tag="optional">
              <TextInput
                type="email"
                value={profile.email}
                onChange={(v) => onUpdate({ email: v })}
                placeholder="your@email.com"
              />
            </Field>
          </>
        )}

        {/* ── STEP 2 ── */}
        {step === 2 && (
          <>
            <SectionHead>Income &amp; expenses</SectionHead>

            <Field
              label="Monthly take-home income"
              hint="Include all household income — salary, partner, side income"
              error={errors.income}
            >
              <MoneyInput
                value={profile.income}
                onChange={(v) => onUpdate({ income: v })}
                placeholder="4,300"
                suffix="/ mo"
              />
            </Field>

            <Field
              label="Monthly essential expenses"
              hint="Rent or mortgage, car, groceries, utilities, subscriptions"
              error={errors.expenses}
            >
              <MoneyInput
                value={profile.expenses}
                onChange={(v) => onUpdate({ expenses: v })}
                placeholder="3,200"
                suffix="/ mo"
              />
            </Field>

            <SectionHead>Savings &amp; debt</SectionHead>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
              <Field label="Savings balance" hint="Combined savings and emergency fund" error={errors.savings}>
                <MoneyInput
                  value={profile.savings}
                  onChange={(v) => onUpdate({ savings: v })}
                  placeholder="18,000"
                />
              </Field>
              <Field label="Monthly debt" tag="optional" hint="Total monthly debt payments">
                <MoneyInput
                  value={profile.debt}
                  onChange={(v) => onUpdate({ debt: v })}
                  placeholder="250"
                  suffix="/ mo"
                />
              </Field>
            </div>

            <SectionHead>Employment type</SectionHead>

            <div style={{ display: 'flex', gap: 8, marginBottom: 4 }}>
              {EMPLOYMENT_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => onUpdate({ employment: opt.value })}
                  style={{
                    flex: 1, padding: '11px 6px', borderRadius: 10,
                    border: `1.5px solid ${profile.employment === opt.value ? C.navy : C.border}`,
                    background: profile.employment === opt.value ? C.navyLt : C.surface,
                    color: profile.employment === opt.value ? C.navy : C.text2,
                    fontSize: 13, fontWeight: 600, fontFamily: 'inherit',
                    cursor: 'pointer', textAlign: 'center', transition: 'all .15s',
                  }}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </>
        )}

        {/* ── Actions ── */}
        <div style={{ marginTop: 32, display: 'flex', flexDirection: 'column', gap: 10 }}>
          {step === 1 ? (
            <button onClick={handleNext} style={btnPrimary}>Continue →</button>
          ) : (
            <>
              <button onClick={handleSubmit} style={btnPrimary}>See my results →</button>
              <button onClick={() => { setStep(1); setErrors({}); }} style={btnGhost}>← Back</button>
            </>
          )}

          <button onClick={onUseDemo} style={btnGhost}>Use demo profile instead</button>

          <div style={{ display: 'flex', alignItems: 'center', gap: 6, justifyContent: 'center', marginTop: 6 }}>
            <LockIcon />
            <span style={{ fontSize: 11, color: C.text3 }}>
              Your data stays on your device. Nothing is transmitted.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Sub-components ─────────────────────────────────────────────────

function Field({ label, tag, hint, error, children }) {
  return (
    <div style={{ marginBottom: 16 }}>
      <div style={{ fontSize: 13, fontWeight: 600, color: C.text2, marginBottom: hint ? 4 : 6, display: 'flex', gap: 6, alignItems: 'center' }}>
        {label}
        {tag && <OptTag />}
      </div>
      {hint && (
        <div style={{ fontSize: 11, color: C.text3, marginBottom: 6, lineHeight: 1.45 }}>
          {hint}
        </div>
      )}
      {children}
      {error && <div style={{ fontSize: 11, color: C.red, marginTop: 4 }}>{error}</div>}
    </div>
  );
}

function SectionHead({ children }) {
  return (
    <div style={{
      fontSize: 11, fontWeight: 700, color: C.text3,
      textTransform: 'uppercase', letterSpacing: '.08em',
      margin: '22px 0 14px', display: 'flex', alignItems: 'center', gap: 10,
    }}>
      {children}
      <div style={{ flex: 1, height: 1, background: C.border }} />
    </div>
  );
}

function TextInput({ value, onChange, placeholder, type = 'text' }) {
  return (
    <div style={inputWrap}>
      <input
        type={type}
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        style={inputStyle}
      />
    </div>
  );
}

function MoneyInput({ value, onChange, placeholder, suffix }) {
  return (
    <div style={{ ...inputWrap, minWidth: 0 }}>
      <div style={prefixStyle}>$</div>
      <input
        type="number"
        min="0"
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        style={{ ...inputStyle, paddingLeft: 12 }}
      />
      {suffix && <div style={suffixStyle}>{suffix}</div>}
    </div>
  );
}

function OptTag() {
  return (
    <span style={{
      fontSize: 10, fontWeight: 500, color: C.text3,
      background: C.surface2, padding: '2px 8px',
      borderRadius: 10, border: `1px solid ${C.border}`,
    }}>
      optional
    </span>
  );
}

function LockIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
      <rect x="1.5" y="5.5" width="9" height="6" rx="1.5" stroke={C.text3} strokeWidth="1.2" />
      <path d="M3.5 5.5V4a2.5 2.5 0 0 1 5 0v1.5" stroke={C.text3} strokeWidth="1.2" fill="none" />
    </svg>
  );
}

// ── Styles ────────────────────────────────────────────────────────

const card = {
  background: C.surface,
  border: `1px solid ${C.border}`,
  borderRadius: 20,
  padding: '48px 52px',
  width: '100%',
  maxWidth: 600,           // wider than before (was 520)
  boxShadow: '0 4px 24px rgba(19,25,54,.08), 0 1px 4px rgba(19,25,54,.05)',
};

const inputWrap = {
  display: 'flex', alignItems: 'center',
  background: C.surface2,
  border: `1.5px solid ${C.border}`,
  borderRadius: 10, height: 46,
  overflow: 'hidden', width: '100%',
  transition: 'border-color .15s',
};

const inputStyle = {
  flex: 1, background: 'transparent', border: 'none', outline: 'none',
  padding: '0 14px', fontSize: 14,
  fontFamily: "'Plus Jakarta Sans', sans-serif",  // matches app font, not monospace
  color: C.text, height: '100%', fontWeight: 500,
};

const prefixStyle = {
  padding: '0 13px', fontSize: 14, color: C.text3,
  borderRight: `1px solid ${C.border}`, height: '100%',
  display: 'flex', alignItems: 'center',
  background: '#eef0f7',
  fontFamily: "'Plus Jakarta Sans', sans-serif",
  flexShrink: 0, fontWeight: 600,
};

const suffixStyle = {
  padding: '0 13px', fontSize: 12,
  color: C.text3, flexShrink: 0,
  fontFamily: "'Plus Jakarta Sans', sans-serif",
};

const btnPrimary = {
  width: '100%', padding: 15, borderRadius: 100,
  fontSize: 15, fontWeight: 700, fontFamily: 'inherit',
  cursor: 'pointer', background: C.navy, color: '#fff',
  border: 'none', boxShadow: '0 2px 12px rgba(19,25,54,.2)',
  transition: 'all .15s',
};

const btnGhost = {
  width: '100%', padding: 14, borderRadius: 100,
  fontSize: 13, fontWeight: 600, fontFamily: 'inherit',
  cursor: 'pointer', background: 'transparent',
  border: `1.5px solid ${C.border2}`,
  color: C.text2, transition: 'all .15s',
};
