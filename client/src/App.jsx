import React, { useEffect, useState } from 'react'
import { useProfile } from './hooks/useProfile'
import { useScenarios } from './hooks/useScenarios'
import { storage } from './services/storage'
import { runSimulation } from './engine/monteCarlo'
import { fetchVerdict } from './services/api'
import WelcomeScreen from './components/onboarding/WelcomeScreen'
import ProfileForm from './components/onboarding/ProfileForm'
import ReturningUserCard from './components/onboarding/ReturningUserCard'
import ScenarioControls from './components/scenarios/ScenarioControls'
import ResultsDashboard from './components/dashboard/ResultsDashboard'
import DecisionMode from './components/decision/DecisionMode'

const C = {
  border: 'rgba(17,28,68,0.08)',
  borderSoft: 'rgba(17,28,68,0.05)',
  accent: '#7b93ff',
  accentSoft: 'rgba(123,147,255,0.10)',
  accentGlow: 'rgba(123,147,255,0.18)',
  navy: '#131936',
  navBg: 'rgba(255,255,255,0.72)',
  navBorder: 'rgba(17,28,68,0.06)',
  text2: '#4B587C',
}

const APP_MODES = { STRESS: 'stress', DECISION: 'decision' }

// ── Fallback verdict ───────────────────────────────────────────────
function buildFallback(riskPercent, survivalMonths) {
  const months = Number(survivalMonths).toFixed(1)
  if (riskPercent > 60) return `With your current scenarios, your savings would last around ${months} months before hitting critical — that's a high-stress position. The single most impactful move right now is building an emergency buffer of at least 3 months of expenses.`
  if (riskPercent > 30) return `You have about ${months} months of runway under these scenarios — manageable but worth watching. Consider setting aside an extra $200–$300/month to strengthen your cushion before the next unexpected expense hits.`
  return `You're in a solid position with ${months} months of runway — the selected scenarios don't pose an immediate threat. Keep building that buffer and you'll be well-prepared for most life shocks.`
}

// ── Home Dashboard ─────────────────────────────────────────────────
function HomeDashboard({ profile, scenarios, onSignOut }) {
  const { activeScenarios, toggleScenario, updateScenarioParam, removeScenario, isActive } = scenarios

  // Decision Intelligence has its own independent scenario state
  const decisionScenarios = useScenarios()

  const [appMode, setAppMode]        = useState(APP_MODES.STRESS)
  const [results, setResults]        = useState(null)
  const [verdict, setVerdict]        = useState(null)
  const [verdictLoading, setLoading] = useState(false)
  const [hasRun, setHasRun]          = useState(false)

  async function handleRun() {
    if (!profile || activeScenarios.length === 0) return
    const nextResults = runSimulation(profile, activeScenarios)
    setResults(nextResults)
    setHasRun(true)
    setVerdict(null)
    setLoading(true)
    const text = await fetchVerdict({
      profile, activeScenarios,
      riskPercent: nextResults.riskPercent,
      survivalMonths: nextResults.survivalMonths,
    })
    setVerdict(text || buildFallback(nextResults.riskPercent, nextResults.survivalMonths))
    setLoading(false)
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'radial-gradient(circle at top center, rgba(123,147,255,0.10), transparent 18%), linear-gradient(180deg, #F7F8FC 0%, #F3F5FA 100%)',
      fontFamily: "'Plus Jakarta Sans', sans-serif",
      color: C.navy,
    }}>

      {/* ── NAV ── */}
      <nav style={{
        position: 'sticky', top: 0, zIndex: 20, height: 74,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 32px', background: C.navBg,
        backdropFilter: 'blur(18px)', WebkitBackdropFilter: 'blur(18px)',
        borderBottom: `1px solid ${C.navBorder}`,
      }}>
        {/* Logo */}
        <div style={{ fontSize: 20, fontWeight: 800, letterSpacing: '-0.04em', color: C.navy }}>
          Life<span style={{ color: C.accent }}>Shock</span>
        </div>

        {/* Mode toggle — plain text, color change only */}
        <div style={{ display: 'flex', gap: 28 }}>
          <button
            onClick={() => setAppMode(APP_MODES.STRESS)}
            style={{
              background: 'none', border: 'none', cursor: 'pointer',
              fontFamily: 'inherit', fontSize: 14, padding: '4px 0',
              fontWeight: appMode === APP_MODES.STRESS ? 800 : 600,
              color: appMode === APP_MODES.STRESS ? C.navy : 'rgba(19,25,54,.35)',
              borderBottom: appMode === APP_MODES.STRESS ? `2px solid ${C.navy}` : '2px solid transparent',
              transition: 'all .2s',
            }}
          >
            Stress test
          </button>
          <button
            onClick={() => setAppMode(APP_MODES.DECISION)}
            style={{
              background: 'none', border: 'none', cursor: 'pointer',
              fontFamily: 'inherit', fontSize: 14, padding: '4px 0',
              fontWeight: appMode === APP_MODES.DECISION ? 800 : 600,
              color: appMode === APP_MODES.DECISION ? C.navy : 'rgba(19,25,54,.35)',
              borderBottom: appMode === APP_MODES.DECISION ? `2px solid ${C.navy}` : '2px solid transparent',
              transition: 'all .2s',
            }}
          >
            Decision intelligence
          </button>
        </div>

        {/* User + sign out */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{
            display: 'flex', alignItems: 'center', gap: 10,
            padding: '6px 10px 6px 6px', borderRadius: 999,
            background: 'rgba(255,255,255,0.76)', border: `1px solid ${C.borderSoft}`,
          }}>
            <div style={{
              width: 30, height: 30, borderRadius: '50%',
              background: `linear-gradient(135deg, ${C.accentSoft}, rgba(255,255,255,0.96))`,
              border: `1px solid ${C.accentGlow}`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: C.accent, fontWeight: 700, fontSize: 12,
            }}>
              {profile.name?.charAt(0)?.toUpperCase() || 'U'}
            </div>
            <span style={{ fontSize: 13, color: C.text2, fontWeight: 600 }}>{profile.name}</span>
          </div>
          <button onClick={onSignOut} style={{
            height: 40, padding: '0 16px', borderRadius: 999,
            border: `1px solid ${C.border}`, background: '#FFFFFF',
            color: C.navy, fontFamily: 'inherit', fontSize: 13,
            fontWeight: 700, cursor: 'pointer',
            boxShadow: '0 4px 14px rgba(17,28,68,0.04)',
          }}>
            Sign out
          </button>
        </div>
      </nav>

      {/* ── STRESS TEST MODE ── */}
      {appMode === APP_MODES.STRESS && (
        <main style={{ padding: 18, height: 'calc(100vh - 74px)', boxSizing: 'border-box' }}>
          <div style={{ height: '100%', display: 'grid', gridTemplateColumns: '390px 1fr', gap: 18 }}>

            {/* Left — Scenario Simulator */}
            <section style={{
              minHeight: 0, background: '#FFFFFF',
              border: `1px solid ${C.border}`, borderRadius: 30,
              overflow: 'hidden', boxShadow: '0 12px 36px rgba(17,28,68,0.06)',
              display: 'flex', flexDirection: 'column',
            }}>
              <div style={{
                padding: '22px 20px 14px', borderBottom: `1px solid ${C.borderSoft}`,
                background: 'linear-gradient(180deg, rgba(19,25,54,0.02), rgba(255,255,255,0.85))',
              }}>
                <h2 style={{
                  margin: 0, fontSize: 17, lineHeight: 1.2,
                  letterSpacing: '0.08em', fontWeight: 800,
                  textTransform: 'uppercase', color: C.navy,
                }}>
                  Scenario simulator
                </h2>
              </div>
              <div style={{ flex: 1, minHeight: 0, overflowY: 'auto', padding: 16 }}>
                <ScenarioControls
                  activeScenarios={activeScenarios}
                  onToggle={toggleScenario}
                  onParamChange={updateScenarioParam}
                  onRemove={removeScenario}
                  isActive={isActive}
                />
              </div>
              <div style={{ padding: '14px 16px', borderTop: '1px solid rgba(17,28,68,.06)' }}>
                <button
                  onClick={handleRun}
                  disabled={verdictLoading || activeScenarios.length === 0}
                  style={{
                    width: '100%', padding: '14px 0', borderRadius: 100,
                    fontSize: 15, fontWeight: 700, fontFamily: 'inherit',
                    cursor: activeScenarios.length === 0 ? 'not-allowed' : 'pointer',
                    background: activeScenarios.length === 0 ? 'rgba(19,25,54,.12)' : C.navy,
                    color: activeScenarios.length === 0 ? 'rgba(19,25,54,.35)' : '#fff',
                    border: 'none', opacity: verdictLoading ? 0.7 : 1,
                    transition: 'all .2s',
                    boxShadow: activeScenarios.length === 0 ? 'none' : '0 4px 16px rgba(19,25,54,.2)',
                  }}
                >
                  {verdictLoading ? '⏳ Getting verdict...' : hasRun ? '↻ Re-run simulation' : '▶ Run simulation'}
                </button>
                {activeScenarios.length === 0 && (
                  <p style={{ margin: '8px 0 0', fontSize: 12, color: '#8591b4', textAlign: 'center' }}>
                    Select a scenario to run
                  </p>
                )}
              </div>
            </section>

            {/* Right — Results */}
            <section style={{
              minHeight: 0,
              background: 'radial-gradient(circle at 18% 18%, rgba(123,147,255,0.08), transparent 22%), linear-gradient(180deg, #F9FAFF 0%, #F6F8FD 100%)',
              border: `1px solid ${C.border}`, borderRadius: 32,
              boxShadow: '0 12px 36px rgba(17,28,68,0.05)', overflow: 'hidden',
            }}>
              <div style={{ width: '100%', height: '100%', padding: 24, boxSizing: 'border-box', overflowY: 'auto' }}>
                <ResultsDashboard
                  results={results}
                  activeScenarios={activeScenarios}
                  profile={profile}
                  verdict={verdict}
                  verdictLoading={verdictLoading}
                  verdictError={false}
                  hasRun={hasRun}
                />
              </div>
            </section>
          </div>
        </main>
      )}

      {/* ── DECISION INTELLIGENCE MODE ── */}
      {appMode === APP_MODES.DECISION && (
        <main style={{ padding: 24, maxWidth: 900, margin: '0 auto', boxSizing: 'border-box' }}>
          <DecisionMode
            profile={profile}
            activeScenarios={decisionScenarios.activeScenarios}
          />
        </main>
      )}

    </div>
  )
}

// ── Routing ────────────────────────────────────────────────────────
const SCREEN = { WELCOME: 'welcome', RETURNING: 'returning', ONBOARDING: 'onboarding' }

export default function App() {
  const profileHook   = useProfile()
  const scenariosHook = useScenarios()
  const { profile, updateProfile, isLoggedIn, loadDemoProfile, completeOnboarding, continueAsReturning, signOut, deleteData } = profileHook
  const [screen, setScreen]            = useState(SCREEN.WELCOME)
  const [noAccountFound, setNoAccount] = useState(false)

  function handleGetStarted()     { setScreen(SCREEN.ONBOARDING) }
  function handleBackToWelcome()  { setScreen(SCREEN.WELCOME) }
  function handleSignIn() {
    const saved = storage.loadProfile()
    if (saved?.name) { setScreen(SCREEN.RETURNING) }
    else { setNoAccount(true); setTimeout(() => { setNoAccount(false); setScreen(SCREEN.ONBOARDING) }, 2200) }
  }
  function handleUseDemo()            { loadDemoProfile() }
  function handleCompleteOnboarding() { completeOnboarding() }
  function handleContinueReturning()  { continueAsReturning() }
  function handleSignOut()   { signOut();   scenariosHook.clearAll(); setScreen(SCREEN.WELCOME) }
  function handleDeleteData(){ deleteData(); scenariosHook.clearAll(); setScreen(SCREEN.WELCOME) }

  if (isLoggedIn) return <HomeDashboard profile={profile} scenarios={scenariosHook} onSignOut={handleSignOut} />
  if (screen === SCREEN.RETURNING) return <ReturningUserCard profile={profile} onContinue={handleContinueReturning} onSignOut={handleSignOut} onDeleteData={handleDeleteData} onBackToWelcome={handleBackToWelcome} />
  if (screen === SCREEN.ONBOARDING) return <ProfileForm profile={profile} onUpdate={updateProfile} onComplete={handleCompleteOnboarding} onUseDemo={handleUseDemo} />

  return (
    <>
      {noAccountFound && (
        <div style={{
          position: 'fixed', bottom: 32, left: '50%', transform: 'translateX(-50%)',
          background: C.navy, color: '#fff', padding: '12px 24px',
          borderRadius: 100, fontSize: 13, fontWeight: 700,
          boxShadow: '0 4px 20px rgba(0,0,0,.4)', zIndex: 999, whiteSpace: 'nowrap',
        }}>
          No account found — redirecting to sign up...
        </div>
      )}
      <WelcomeScreen onGetStarted={handleGetStarted} onSignIn={handleSignIn} onUseDemo={handleUseDemo} />
    </>
  )
}
