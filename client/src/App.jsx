// client/src/App.jsx
import React, { useState } from 'react'
import { useProfile }    from './hooks/useProfile'
import { useScenarios }  from './hooks/useScenarios'
import { storage }       from './services/storage'
import WelcomeScreen     from './components/onboarding/WelcomeScreen'
import ProfileForm       from './components/onboarding/ProfileForm'
import ReturningUserCard from './components/onboarding/ReturningUserCard'
import ScenarioControls  from './components/scenarios/ScenarioControls'

function HomeDashboard({ profile, scenarios, onSignOut }) {
  const {
    activeScenarios,
    toggleScenario,
    updateScenarioParam,
    removeScenario,
    isActive,
  } = scenarios

  return (
    <div style={{
      minHeight: '100vh',
      background: '#f0f2f8',
      fontFamily: "'Plus Jakarta Sans', sans-serif",
      display: 'flex',
      flexDirection: 'column',
    }}>

      {/* Navbar — translucent, matches WelcomeScreen exactly */}
      <nav style={{
        position: 'sticky', top: 0, zIndex: 10,
        display: 'flex', alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 40px', height: 68,
        background: 'rgba(19,25,54,.25)',
        backdropFilter: 'blur(24px)',
        WebkitBackdropFilter: 'blur(24px)',
        borderBottom: '1px solid rgba(255,255,255,.06)',
      }}>
        <div style={{
          fontSize: 20, fontWeight: 800,
          color: '#fff', letterSpacing: '-0.5px',
        }}>
          Life<span style={{ color: '#7b93ff' }}>Shock</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{
              width: 30, height: 30, borderRadius: '50%',
              background: 'rgba(123,147,255,.25)',
              display: 'flex', alignItems: 'center',
              justifyContent: 'center',
              fontSize: 12, fontWeight: 700, color: '#7b93ff',
            }}>
              {profile.name?.charAt(0).toUpperCase()}
            </div>
            <span style={{ fontSize: 14, color: 'rgba(255,255,255,.6)', fontWeight: 500 }}>
              {profile.name}
            </span>
          </div>
          <div style={{ width: 1, height: 16, background: 'rgba(255,255,255,.1)' }} />
          <button onClick={onSignOut} style={{
            padding: '7px 18px', borderRadius: 100,
            fontSize: 13, fontWeight: 600,
            fontFamily: 'inherit', cursor: 'pointer',
            background: 'transparent', color: 'rgba(255,255,255,.6)',
            border: '1.5px solid rgba(255,255,255,.2)',
            transition: 'all .15s',
          }}>
            Sign out
          </button>
        </div>
      </nav>

      {/* Full height two-column layout */}
      <div style={{
        flex: 1,
        display: 'grid',
        gridTemplateColumns: '420px 1fr',
        gap: 0,
        height: 'calc(100vh - 68px)',
      }}>

        {/* Left panel — full height, scrollable */}
        <div style={{
          background: '#ffffff',
          borderRight: '1px solid rgba(19,25,54,.08)',
          padding: '28px 24px',
          overflowY: 'auto',
          height: '100%',
        }}>
          <ScenarioControls
            activeScenarios={activeScenarios}
            onToggle={toggleScenario}
            onParamChange={updateScenarioParam}
            onRemove={removeScenario}
            isActive={isActive}
          />
        </div>

        {/* Right panel — full height */}
        <div style={{
          background: '#f8f9ff',
          padding: '28px 24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'column',
          gap: 12,
          height: '100%',
        }}>
          <div style={{
            width: 52, height: 52, borderRadius: 14,
            background: 'rgba(123,147,255,.1)',
            display: 'flex', alignItems: 'center',
            justifyContent: 'center',
          }}>
            <svg width="24" height="24" viewBox="0 0 18 18" fill="none">
              <rect x="1" y="8" width="3.5" height="9" rx="1"
                stroke="#7b93ff" strokeWidth="1.4" fill="none" />
              <rect x="7.25" y="5" width="3.5" height="12" rx="1"
                stroke="#7b93ff" strokeWidth="1.4" fill="none" />
              <rect x="13.5" y="1" width="3.5" height="16" rx="1"
                stroke="#7b93ff" strokeWidth="1.4" fill="none" />
            </svg>
          </div>
          <div style={{ fontSize: 16, fontWeight: 700, color: '#4a5080', textAlign: 'center' }}>
            Results dashboard
          </div>
          <div style={{ fontSize: 13, color: '#8b91b8', textAlign: 'center' }}>
            Phase 6 — coming next
          </div>
          {activeScenarios.length > 0 && (
            <div style={{
              marginTop: 8, padding: '8px 18px',
              background: 'rgba(123,147,255,.08)',
              border: '1px solid rgba(123,147,255,.2)',
              borderRadius: 100, fontSize: 13,
              color: '#7b93ff', fontWeight: 600,
            }}>
              {activeScenarios.length} scenario{activeScenarios.length > 1 ? 's' : ''} active
            </div>
          )}
        </div>

      </div>
    </div>
  )
}
// ── Screen enum ───────────────────────────────────────────────────
const SCREEN = {
  WELCOME:    'welcome',
  RETURNING:  'returning',
  ONBOARDING: 'onboarding',
  HOME:       'home',
}

// ── App ───────────────────────────────────────────────────────────
export default function App() {
  const profileHook   = useProfile()
  const scenariosHook = useScenarios()

  const {
    profile, updateProfile, isLoggedIn,
    loadDemoProfile, completeOnboarding,
    continueAsReturning, signOut, deleteData,
  } = profileHook

  const [screen, setScreen]       = useState(SCREEN.WELCOME)
  const [noAccountFound, setNoAccount] = useState(false)

  // ── Handlers ────────────────────────────────────────────────────
  function handleGetStarted()        { setScreen(SCREEN.ONBOARDING) }
  function handleBackToWelcome()     { setScreen(SCREEN.WELCOME) }

  function handleSignIn() {
    const saved = storage.loadProfile()
    if (saved?.name) {
      setScreen(SCREEN.RETURNING)
    } else {
      setNoAccount(true)
      setTimeout(() => { setNoAccount(false); setScreen(SCREEN.ONBOARDING) }, 2200)
    }
  }

  function handleUseDemo()           { loadDemoProfile() }
  function handleCompleteOnboarding(){ completeOnboarding() }
  function handleContinueReturning() { continueAsReturning() }

  function handleSignOut() {
    signOut()
    scenariosHook.clearAll()
    setScreen(SCREEN.WELCOME)
  }

  function handleDeleteData() {
    deleteData()
    scenariosHook.clearAll()
    setScreen(SCREEN.WELCOME)
  }

  // ── Routing ─────────────────────────────────────────────────────
  if (isLoggedIn) {
    return (
      <HomeDashboard
        profile={profile}
        scenarios={scenariosHook}
        onSignOut={handleSignOut}
      />
    )
  }

  if (screen === SCREEN.RETURNING) {
    return (
      <ReturningUserCard
        profile={profile}
        onContinue={handleContinueReturning}
        onSignOut={handleSignOut}
        onDeleteData={handleDeleteData}
        onBackToWelcome={handleBackToWelcome}
      />
    )
  }

  if (screen === SCREEN.ONBOARDING) {
    return (
      <ProfileForm
        profile={profile}
        onUpdate={updateProfile}
        onComplete={handleCompleteOnboarding}
        onUseDemo={handleUseDemo}
      />
    )
  }

  return (
    <>
      {noAccountFound && (
        <div style={{
          position: 'fixed', bottom: 32, left: '50%',
          transform: 'translateX(-50%)',
          background: '#D9B991', color: '#0D0C00',
          padding: '12px 24px', borderRadius: 100,
          fontSize: 13, fontWeight: 700,
          boxShadow: '0 4px 20px rgba(0,0,0,.4)',
          zIndex: 999, whiteSpace: 'nowrap',
        }}>
          No account found — redirecting to sign up...
        </div>
      )}
      <WelcomeScreen
        onGetStarted={handleGetStarted}
        onSignIn={handleSignIn}
        onUseDemo={handleUseDemo}
      />
    </>
  )
}