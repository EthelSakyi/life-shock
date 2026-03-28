import React from 'react';

export default function WelcomeScreen({ onGetStarted, onSignIn, onUseDemo }) {
  return (
    <div style={{
      minHeight: '100vh', display: 'flex', flexDirection: 'column',
      position: 'relative', overflow: 'hidden', background: '#131936',
    }}>
      <style>{`
        @keyframes drift1 {
          0%   { transform: translateX(-50%) translateY(0) scale(1); }
          50%  { transform: translateX(-48%) translateY(-30px) scale(1.06); }
          100% { transform: translateX(-50%) translateY(0) scale(1); }
        }
        @keyframes drift2 {
          0%   { transform: translateY(0) scale(1); }
          50%  { transform: translateY(-40px) scale(1.08); }
          100% { transform: translateY(0) scale(1); }
        }
        @keyframes drift3 {
          0%   { transform: translateY(0) scale(1); }
          50%  { transform: translateY(30px) scale(1.05); }
          100% { transform: translateY(0) scale(1); }
        }
        @keyframes drift4 {
          0%   { transform: translateY(0) scale(1); }
          50%  { transform: translateY(-20px) scale(1.04); }
          100% { transform: translateY(0) scale(1); }
        }
        .ls-primary:hover { background: #e8edff !important; transform: translateY(-2px) !important; }
        .ls-ghost:hover   { border-color: rgba(255,255,255,.65) !important; background: rgba(255,255,255,.08) !important; }
        .ls-signin:hover  { background: rgba(255,255,255,.08) !important; }
      `}</style>

      {/* Large white cloud — top center */}
      <div style={{ position:'absolute', width:'900px', height:'900px', borderRadius:'50%', pointerEvents:'none',
        background:'radial-gradient(circle,rgba(255,255,255,.18) 0%,rgba(255,255,255,.08) 35%,transparent 65%)',
        top:'-250px', left:'50%', filter:'blur(70px)',
        animation:'drift1 12s ease-in-out infinite' }} />

      {/* Left blue-white cloud */}
      <div style={{ position:'absolute', width:'700px', height:'700px', borderRadius:'50%', pointerEvents:'none',
        background:'radial-gradient(circle,rgba(180,190,255,.2) 0%,rgba(180,190,255,.08) 40%,transparent 70%)',
        bottom:'-100px', left:'-200px', filter:'blur(80px)',
        animation:'drift2 16s ease-in-out infinite' }} />

      {/* Right cloud */}
      <div style={{ position:'absolute', width:'600px', height:'600px', borderRadius:'50%', pointerEvents:'none',
        background:'radial-gradient(circle,rgba(255,255,255,.12) 0%,rgba(200,210,255,.06) 45%,transparent 70%)',
        top:'0px', right:'-100px', filter:'blur(90px)',
        animation:'drift3 14s ease-in-out infinite 2s' }} />

      {/* Bottom right whisp */}
      <div style={{ position:'absolute', width:'500px', height:'500px', borderRadius:'50%', pointerEvents:'none',
        background:'radial-gradient(circle,rgba(255,255,255,.1) 0%,transparent 65%)',
        bottom:'-150px', right:'10%', filter:'blur(100px)',
        animation:'drift4 18s ease-in-out infinite 4s' }} />

      {/* ── NAV — logo + auth buttons only, NO tabs ── */}
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 10,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 48px', height: 68,
        background: 'rgba(19,25,54,.25)',
        backdropFilter: 'blur(24px)',
        WebkitBackdropFilter: 'blur(24px)',
        borderBottom: '1px solid rgba(255,255,255,.06)',
      }}>
        <div style={{ fontSize: 20, fontWeight: 800, color: '#fff', letterSpacing: '-0.5px' }}>
          Life<span style={{ color: '#7b93ff' }}>Shock</span>
        </div>

        <div style={{ display: 'flex', gap: 8 }}>
          <button className="ls-signin" onClick={onSignIn} style={{
            padding: '10px 24px', borderRadius: 100, fontSize: 14, fontWeight: 600,
            fontFamily: 'inherit', cursor: 'pointer', background: 'transparent',
            border: '1.5px solid rgba(255,255,255,.25)', color: '#fff', transition: 'all .15s',
          }}>
            Sign in
          </button>
          <button className="ls-primary" onClick={onGetStarted} style={{
            padding: '10px 24px', borderRadius: 100, fontSize: 14, fontWeight: 700,
            fontFamily: 'inherit', cursor: 'pointer', background: '#fff',
            color: '#131936', border: 'none',
            boxShadow: '0 2px 14px rgba(0,0,0,.25)', transition: 'all .15s',
          }}>
            Get started →
          </button>
        </div>
      </nav>

      {/* ── HERO ── */}
      <div style={{
        flex: 1, display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        textAlign: 'center', padding: '60px 24px 80px',
        paddingTop: 128,
        position: 'relative', zIndex: 1,
      }}>
        <div style={{ maxWidth: 860, width: '100%' }}>

          <h1 style={{
            fontSize: 'clamp(40px,5.8vw,72px)', fontWeight: 800,
            letterSpacing: '-3px', lineHeight: 1.06,
            marginBottom: 24, color: '#fff',
            maxWidth: 780, margin: '0 auto 24px',
          }}>
            Will you be okay<br />
            if something{' '}
            <em style={{ fontStyle: 'normal', color: '#7b93ff' }}>goes wrong?</em>
          </h1>

          <p style={{
            fontSize: 18, color: 'rgba(255,255,255,.6)', lineHeight: 1.7,
            margin: '0 auto 48px', maxWidth: 520,
          }}>
            Stress-test your finances against job loss, medical bills,
            and unexpected costs. Know your resilience in under 60 seconds.
          </p>

          <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 80 }}>
            <button className="ls-primary" onClick={onGetStarted} style={{
              padding: '17px 40px', borderRadius: 100, fontSize: 16, fontWeight: 700,
              fontFamily: 'inherit', cursor: 'pointer', background: '#fff',
              color: '#131936', border: 'none',
              boxShadow: '0 4px 24px rgba(0,0,0,.3)', transition: 'all .2s',
            }}>
              Get started
            </button>
            <button className="ls-ghost" onClick={onUseDemo} style={{
              padding: '17px 40px', borderRadius: 100, fontSize: 16, fontWeight: 700,
              fontFamily: 'inherit', cursor: 'pointer', background: 'transparent',
              color: '#fff', border: '2px solid rgba(255,255,255,.3)', transition: 'all .2s',
            }}>
              Use demo profile
            </button>
          </div>

          {/* Stats */}
          <div style={{ display: 'flex', justifyContent: 'center', paddingTop: 48, borderTop: '1px solid rgba(255,255,255,.1)' }}>
            {[['1k','scenarios / run'],['<60s','to your result'],['0','data transmitted']].map(([num, label], i) => (
              <div key={label} style={{
                padding: '0 52px', textAlign: 'center',
                borderLeft: i === 0 ? 'none' : '1px solid rgba(255,255,255,.1)',
              }}>
                <div style={{ fontSize: 28, fontWeight: 800, fontFamily:"'DM Mono',monospace", color: '#4ade80', letterSpacing: '-1px' }}>
                  {num}
                </div>
                <div style={{ fontSize: 11, color: 'rgba(255,255,255,.4)', textTransform: 'uppercase', letterSpacing: '.08em', marginTop: 4 }}>
                  {label}
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>
    </div>
  );
}
