import React, { useEffect, useState, useRef, useCallback } from 'react'
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

const C = {
  pageBg: '#F4F6FB',
  text: '#111C44',
  text2: '#4B587C',
  text3: '#8591B4',
  border: 'rgba(17,28,68,0.08)',
  borderSoft: 'rgba(17,28,68,0.05)',
  accent: '#7b93ff',
  accentSoft: 'rgba(123,147,255,0.10)',
  accentGlow: 'rgba(123,147,255,0.18)',
  navy: '#131936',
  navBg: 'rgba(255,255,255,0.72)',
  navBorder: 'rgba(17,28,68,0.06)',
}

// ── Debounce hook ──────────────────────────────────────────────────
function useDebounce(value, delay) {
  const [debounced, setDebounced] = useState(value)
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay)
    return () => clearTimeout(t)
  }, [value, delay])
  return debounced
}

// ── Fallback verdict copy ──────────────────────────────────────────
function buildFallback(riskPercent, survivalMonths, profile) {
  if (riskPercent === 0) return null // no scenarios yet
  const level = riskPercent > 60 ? 'high' : riskPercent > 30 ? 'moderate' : 'low'
  const months = Number(survivalMonths).toFixed(1)
  if (level === 'high') {
    return `With your current scenarios, ${profile.name}'s savings would last around ${months} months before hitting critical — that's a high-stress position. The single most impactful move right now is building an emergency buffer of at least 3 months of expenses.`
  }
  if (level === 'moderate') {
    return `${profile.name} has about ${months} months of runway under these scenarios — manageable but worth watching. Consider setting aside an extra $200–$300/month to strengthen your cushion before the next unexpected expense hits.`
  }
  return `${profile.name} is in a solid position with ${months} months of runway — the selected scenarios don't pose an immediate threat. Keep building that buffer and you'll be well-prepared for most life shocks.`
}

// ── Home Dashboard ─────────────────────────────────────────────────
function HomeDashboard({ profile, scenarios, onSignOut }) {
  const { activeScenarios, toggleScenario, updateScenarioParam, removeScenario, isActive } = scenarios

  const [results, setResults] = useState(() => runSimulation(profile, []))
  const [verdict, setVerdict]           = useState(null)
  const [verdictLoading, setLoading]    = useState(false)
  const [verdictError, setError]        = useState(false)

  // Debounce activeScenarios by 800ms so we don't call API on every slider tick
  const debouncedScenarios = useDebounce(activeScenarios, 800)

  // Run simulation immediately on every change (fast, local)
  useEffect(() => {
    if (!profile) return
    setResults(runSimulation(profile, activeScenarios))
  }, [profile, activeScenarios])

  // Call Claude API on debounced scenarios only
  useEffect(() => {
    if (!profile) return

    const { riskPercent, survivalMonths } = runSimulation(profile, debouncedScenarios)

    // Don't call API if no scenarios selected
    if (debouncedScenarios.length === 0) {
      setVerdict(null)
      setLoading(false)
      return
    }

    let cancelled = false
    setLoading(true)
    setError(false)

    fetchVerdict({ profile, activeScenarios: debouncedScenarios, riskPercent, survivalMonths })
      .then((text) => {
        if (cancelled) return
        if (text) {
          setVerdict(text)
        } else {
          // API returned null — use fallback silently
          setVerdict(buildFallback(riskPercent, survivalMonths, profile))
        }
        setLoading(false)
      })
      .catch(() => {
        if (cancelled) return
        setVerdict(buildFallback(riskPercent, survivalMonths, profile))
        setLoading(false)
        setError(false) // never show error to user
      })

    return () => { cancelled = true }
  }, [profile, debouncedScenarios])

  return (
    <div style={{
      minHeight: '100vh',
      background: `
        radial-gradient(circle at top center, rgba(123,147,255,0.10), transparent 18%),
        linear-gradient(180deg, #F7F8FC 0%, #F3F5FA 100%)
      `,
      fontFamily: "'Plus Jakarta Sans', sans-serif",
      color: C.text,
    }}>
      <nav style={{
        position: 'sticky', top: 0, zIndex: 20, height: 74,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 32px', background: C.navBg,
        backdropFilter: 'blur(18px)', WebkitBackdropFilter: 'blur(18px)',
        borderBottom: `1px solid ${C.navBorder}`,
      }}>
        <div style={{ fontSize: 20, fontWeight: 800, letterSpacing: '-0.04em', color: C.navy }}>
          Life<span style={{ color: C.accent }}>Shock</span>
        </div>

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
                textTransform: 'uppercase', color: '#131936',
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
          </section>

          {/* Right — Results Dashboard */}
          <section style={{
            minHeight: 0,
            background: `
              radial-gradient(circle at 18% 18%, rgba(123,147,255,0.08), transparent 22%),
              linear-gradient(180deg, #F9FAFF 0%, #F6F8FD 100%)
            `,
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
                verdictError={verdictError}
              />
            </div>
          </section>

        </div>
      </main>
    </div>
  )
}

// ── Routing ────────────────────────────────────────────────────────
const SCREEN = { WELCOME: 'welcome', RETURNING: 'returning', ONBOARDING: 'onboarding' }

export default function App() {
  const profileHook  = useProfile()
  const scenariosHook = useScenarios()

  const { profile, updateProfile, isLoggedIn, loadDemoProfile, completeOnboarding, continueAsReturning, signOut, deleteData } = profileHook

  const [screen, setScreen]           = useState(SCREEN.WELCOME)
  const [noAccountFound, setNoAccount] = useState(false)

  function handleGetStarted()      { setScreen(SCREEN.ONBOARDING) }
  function handleBackToWelcome()   { setScreen(SCREEN.WELCOME) }

  function handleSignIn() {
    const saved = storage.loadProfile()
    if (saved?.name) { setScreen(SCREEN.RETURNING) }
    else {
      setNoAccount(true)
      setTimeout(() => { setNoAccount(false); setScreen(SCREEN.ONBOARDING) }, 2200)
    }
  }

  function handleUseDemo()             { loadDemoProfile() }
  function handleCompleteOnboarding()  { completeOnboarding() }
  function handleContinueReturning()   { continueAsReturning() }

  function handleSignOut()   { signOut();   scenariosHook.clearAll(); setScreen(SCREEN.WELCOME) }
  function handleDeleteData(){ deleteData(); scenariosHook.clearAll(); setScreen(SCREEN.WELCOME) }

  if (isLoggedIn) {
    return <HomeDashboard profile={profile} scenarios={scenariosHook} onSignOut={handleSignOut} />
  }

  if (screen === SCREEN.RETURNING) {
    return <ReturningUserCard profile={profile} onContinue={handleContinueReturning} onSignOut={handleSignOut} onDeleteData={handleDeleteData} onBackToWelcome={handleBackToWelcome} />
  }

  if (screen === SCREEN.ONBOARDING) {
    return <ProfileForm profile={profile} onUpdate={updateProfile} onComplete={handleCompleteOnboarding} onUseDemo={handleUseDemo} />
  }

  return (
    <>
      {noAccountFound && (
        <div style={{
          position: 'fixed', bottom: 32, left: '50%', transform: 'translateX(-50%)',
          background: '#131936', color: '#fff', padding: '12px 24px',
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
