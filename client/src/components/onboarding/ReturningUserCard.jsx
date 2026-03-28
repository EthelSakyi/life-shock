import React from 'react';

const C = {
  bg:      '#f8f9ff',
  surface: '#ffffff',
  surface2:'#f3f4f8',
  border:  'rgba(19,25,54,.1)',
  text:    '#0f1235',
  text2:   '#4a5080',
  text3:   '#8b91b8',
  navy:    '#131936',
  red:     '#dc2626',
};

export default function ReturningUserCard({ profile, onContinue, onSignOut, onDeleteData }) {
  const fmt = (n) => n ? `$${Number(n).toLocaleString()}` : '—';

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center',
      justifyContent: 'center', padding: '24px', background: C.bg,
    }}>
      <div style={{
        background: C.surface,
        border: `1px solid ${C.border}`,
        borderRadius: 20, padding: '44px 48px',
        maxWidth: 480, width: '100%',
        boxShadow: '0 4px 24px rgba(19,25,54,.08)',
        textAlign: 'center',
      }}>

        {/* Avatar */}
        <div style={{
          width: 64, height: 64, borderRadius: '50%',
          background: C.navy,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 26, fontWeight: 800, color: '#fff',
          margin: '0 auto 20px',
        }}>
          {profile.name?.charAt(0).toUpperCase() || 'A'}
        </div>

        <h2 style={{ fontSize: 26, fontWeight: 800, color: C.text, letterSpacing: '-0.5px', marginBottom: 8 }}>
          Welcome back, {profile.name}
        </h2>
        <p style={{ fontSize: 14, color: C.text2, marginBottom: 40, lineHeight: 1.6 }}>
          Pick up right where you left off.
        </p>



        {/* Continue CTA */}
        <button
          onClick={onContinue}
          style={{
            width: '100%', padding: 15, borderRadius: 100,
            fontSize: 15, fontWeight: 700, fontFamily: 'inherit',
            cursor: 'pointer', background: C.navy, color: '#fff',
            border: 'none', boxShadow: '0 2px 12px rgba(19,25,54,.2)',
            transition: 'all .15s', marginBottom: 20,
          }}
        >
          Continue where I left off →
        </button>

        {/* Secondary actions */}
        <div style={{ display: 'flex', gap: 16, justifyContent: 'center', alignItems: 'center' }}>
          <button onClick={onSignOut} style={txtBtn}>
            Sign out
          </button>
          <span style={{ color: C.border, fontSize: 16 }}>·</span>
          <button onClick={onDeleteData} style={{ ...txtBtn, color: C.red }}>
            Delete my data
          </button>
        </div>
      </div>
    </div>
  );
}

const txtBtn = {
  background: 'none', border: 'none', cursor: 'pointer',
  fontSize: 13, color: '#8b91b8',
  fontFamily: 'inherit', transition: 'color .15s', padding: 0,
};
