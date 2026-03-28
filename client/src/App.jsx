import React, { useEffect, useMemo, useState } from 'react'
import { AlertTriangle, BarChart3, ShieldCheck, TrendingDown } from 'lucide-react'
import { useProfile } from './hooks/useProfile'
import { useScenarios } from './hooks/useScenarios'
import { storage } from './services/storage'
import { runSimulation } from './engine/monteCarlo'
import WelcomeScreen from './components/onboarding/WelcomeScreen'
import ProfileForm from './components/onboarding/ProfileForm'
import ReturningUserCard from './components/onboarding/ReturningUserCard'
import ScenarioControls from './components/scenarios/ScenarioControls'

const C = {
  pageBg: '#F4F6FB',
  text: '#111C44',
  text2: '#4B587C',
  text3: '#8591B4',
  border: 'rgba(17,28,68,0.08)',
  borderSoft: 'rgba(17,28,68,0.05)',
  accent: '#6F86FF',
  accent2: '#8CA4FF',
  accentSoft: 'rgba(111,134,255,0.10)',
  accentGlow: 'rgba(111,134,255,0.18)',
  navy: '#131936',
  navBg: 'rgba(255,255,255,0.72)',
  navBorder: 'rgba(17,28,68,0.06)',
  success: '#1A7F5A',
  successSoft: 'rgba(26,127,90,0.10)',
  warning: '#B26A00',
  warningSoft: 'rgba(178,106,0,0.10)',
  danger: '#B42318',
  dangerSoft: 'rgba(180,35,24,0.10)',
}

function getRiskBand(riskPercent) {
  if (riskPercent <= 20) {
    return {
      label: 'Low risk',
      color: C.success,
      bg: C.successSoft,
      icon: ShieldCheck,
    }
  }

  if (riskPercent <= 50) {
    return {
      label: 'Moderate risk',
      color: C.warning,
      bg: C.warningSoft,
      icon: AlertTriangle,
    }
  }

  return {
    label: 'High risk',
    color: C.danger,
    bg: C.dangerSoft,
    icon: TrendingDown,
  }
}

function StatCard({ title, value, subtext }) {
  return (
    <div
      style={{
        padding: '18px 18px 16px',
        borderRadius: 20,
        background: '#FFFFFF',
        border: `1px solid ${C.border}`,
        boxShadow: '0 8px 22px rgba(17,28,68,0.04)',
      }}
    >
      <div
        style={{
          fontSize: 11,
          fontWeight: 800,
          textTransform: 'uppercase',
          letterSpacing: '0.10em',
          color: C.text3,
          marginBottom: 10,
        }}
      >
        {title}
      </div>

      <div
        style={{
          fontSize: 32,
          lineHeight: 1,
          fontWeight: 800,
          letterSpacing: '-0.04em',
          color: C.navy,
          marginBottom: 8,
        }}
      >
        {value}
      </div>

      <div
        style={{
          fontSize: 13,
          lineHeight: 1.5,
          color: C.text3,
        }}
      >
        {subtext}
      </div>
    </div>
  )
}

function HomeDashboard({ profile, scenarios, onSignOut }) {
  const {
    activeScenarios,
    toggleScenario,
    updateScenarioParam,
    removeScenario,
    isActive,
  } = scenarios

  const [results, setResults] = useState(() =>
    runSimulation(profile, [])
  )

  useEffect(() => {
    if (!profile) return
    const nextResults = runSimulation(profile, activeScenarios)
    setResults(nextResults)
  }, [profile, activeScenarios])

  const riskBand = useMemo(
    () => getRiskBand(results?.riskPercent ?? 0),
    [results]
  )

  const RiskIcon = riskBand.icon

  return (
    <div
      style={{
        minHeight: '100vh',
        background: `
          radial-gradient(circle at top center, rgba(111,134,255,0.10), transparent 18%),
          linear-gradient(180deg, #F7F8FC 0%, #F3F5FA 100%)
        `,
        fontFamily: "'Plus Jakarta Sans', sans-serif",
        color: C.text,
      }}
    >
      <nav
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 20,
          height: 74,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 32px',
          background: C.navBg,
          backdropFilter: 'blur(18px)',
          WebkitBackdropFilter: 'blur(18px)',
          borderBottom: `1px solid ${C.navBorder}`,
        }}
      >
        <div
          style={{
            fontSize: 20,
            fontWeight: 800,
            letterSpacing: '-0.04em',
            color: C.navy,
          }}
        >
          Life<span style={{ color: C.accent }}>Shock</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              padding: '6px 10px 6px 6px',
              borderRadius: 999,
              background: 'rgba(255,255,255,0.76)',
              border: `1px solid ${C.borderSoft}`,
            }}
          >
            <div
              style={{
                width: 30,
                height: 30,
                borderRadius: '50%',
                background: `linear-gradient(135deg, ${C.accentSoft}, rgba(255,255,255,0.96))`,
                border: `1px solid ${C.accentGlow}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: C.accent,
                fontWeight: 700,
                fontSize: 12,
              }}
            >
              {profile.name?.charAt(0)?.toUpperCase() || 'U'}
            </div>

            <span
              style={{
                fontSize: 13,
                color: C.text2,
                fontWeight: 600,
              }}
            >
              {profile.name}
            </span>
          </div>

          <button
            onClick={onSignOut}
            style={{
              height: 40,
              padding: '0 16px',
              borderRadius: 999,
              border: `1px solid ${C.border}`,
              background: '#FFFFFF',
              color: C.navy,
              fontFamily: 'inherit',
              fontSize: 13,
              fontWeight: 700,
              cursor: 'pointer',
              boxShadow: '0 4px 14px rgba(17,28,68,0.04)',
            }}
          >
            Sign out
          </button>
        </div>
      </nav>

      <main
        style={{
          padding: 18,
          height: 'calc(100vh - 74px)',
          boxSizing: 'border-box',
        }}
      >
        <div
          style={{
            height: '100%',
            display: 'grid',
            gridTemplateColumns: '390px 1fr',
            gap: 18,
          }}
        >
          <section
            style={{
              minHeight: 0,
              background: '#FFFFFF',
              border: `1px solid ${C.border}`,
              borderRadius: 30,
              overflow: 'hidden',
              boxShadow: '0 12px 36px rgba(17,28,68,0.06)',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <div
              style={{
                padding: '22px 20px 14px',
                borderBottom: `1px solid ${C.borderSoft}`,
                background:
                  'linear-gradient(180deg, rgba(18,29,73,0.02), rgba(255,255,255,0.85))',
              }}
            >
              <h2
                style={{
                  margin: 0,
                  fontSize: 17,
                  lineHeight: 1.2,
                  letterSpacing: '0.08em',
                  fontWeight: 800,
                  textTransform: 'uppercase',
                  color: '#131936',
                }}
              >
                Scenario simulator
              </h2>
            </div>

            <div
              style={{
                flex: 1,
                minHeight: 0,
                overflowY: 'auto',
                padding: 16,
              }}
            >
              <ScenarioControls
                activeScenarios={activeScenarios}
                onToggle={toggleScenario}
                onParamChange={updateScenarioParam}
                onRemove={removeScenario}
                isActive={isActive}
              />
            </div>
          </section>

          <section
            style={{
              minHeight: 0,
              background: `
                radial-gradient(circle at 18% 18%, rgba(111,134,255,0.08), transparent 22%),
                linear-gradient(180deg, #F9FAFF 0%, #F6F8FD 100%)
              `,
              border: `1px solid ${C.border}`,
              borderRadius: 32,
              boxShadow: '0 12px 36px rgba(17,28,68,0.05)',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                position: 'relative',
                zIndex: 1,
                width: '100%',
                height: '100%',
                padding: 24,
                boxSizing: 'border-box',
                overflowY: 'auto',
              }}
            >
              <div
                style={{
                  maxWidth: 920,
                  margin: '0 auto',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 18,
                }}
              >
                <div
                  style={{
                    padding: '24px 24px 22px',
                    borderRadius: 28,
                    background: 'rgba(255,255,255,0.76)',
                    border: `1px solid ${C.border}`,
                    backdropFilter: 'blur(10px)',
                    WebkitBackdropFilter: 'blur(10px)',
                    boxShadow: '0 12px 30px rgba(17,28,68,0.05)',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      justifyContent: 'space-between',
                      gap: 16,
                      marginBottom: 22,
                    }}
                  >
                    <div>
                      <div
                        style={{
                          fontSize: 13,
                          fontWeight: 800,
                          textTransform: 'uppercase',
                          letterSpacing: '0.10em',
                          color: C.text3,
                          marginBottom: 8,
                        }}
                      >
                        Results dashboard
                      </div>

                      <div
                        style={{
                          fontSize: 30,
                          lineHeight: 1.05,
                          letterSpacing: '-0.04em',
                          fontWeight: 800,
                          color: C.navy,
                          marginBottom: 10,
                        }}
                      >
                        Your resilience snapshot
                      </div>

                      <div
                        style={{
                          fontSize: 14,
                          lineHeight: 1.6,
                          color: C.text3,
                          maxWidth: 520,
                        }}
                      >
                        Results rerun automatically every time you add, remove,
                        or edit a scenario.
                      </div>
                    </div>

                    <div
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 8,
                        padding: '10px 14px',
                        borderRadius: 999,
                        background: riskBand.bg,
                        color: riskBand.color,
                        border: `1px solid ${C.border}`,
                        fontSize: 13,
                        fontWeight: 800,
                        whiteSpace: 'nowrap',
                      }}
                    >
                      <RiskIcon size={16} />
                      {riskBand.label}
                    </div>
                  </div>

                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
                      gap: 14,
                    }}
                  >
                    <StatCard
                      title="Risk of shortfall"
                      value={`${results?.riskPercent ?? 0}%`}
                      subtext="Estimated share of simulation runs that fall into financial distress."
                    />

                    <StatCard
                      title="Survival window"
                      value={`${results?.survivalMonths ?? 12} mo`}
                      subtext="Median number of months your finances stay above the threshold."
                    />

                    <StatCard
                      title="Scenarios active"
                      value={activeScenarios.length}
                      subtext="Live count of selected life events currently affecting the model."
                    />
                  </div>
                </div>

                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '1.3fr 1fr',
                    gap: 18,
                  }}
                >
                  <div
                    style={{
                      padding: '20px 22px',
                      borderRadius: 24,
                      background: '#FFFFFF',
                      border: `1px solid ${C.border}`,
                      boxShadow: '0 8px 22px rgba(17,28,68,0.04)',
                    }}
                  >
                    <div
                      style={{
                        fontSize: 12,
                        fontWeight: 800,
                        textTransform: 'uppercase',
                        letterSpacing: '0.10em',
                        color: C.text3,
                        marginBottom: 12,
                      }}
                    >
                      Scenario effect
                    </div>

                    <div
                      style={{
                        fontSize: 15,
                        lineHeight: 1.7,
                        color: C.text2,
                      }}
                    >
                      {activeScenarios.length === 0 ? (
                        'No shock scenarios selected yet. Your current profile is being simulated as the baseline case.'
                      ) : (
                        <>
                          You are testing <strong style={{ color: C.navy }}>{activeScenarios.length}</strong>{' '}
                          active scenario{activeScenarios.length > 1 ? 's' : ''}. The engine is already rerunning on every change and updating this panel instantly.
                        </>
                      )}
                    </div>
                  </div>

                  <div
                    style={{
                      padding: '20px 22px',
                      borderRadius: 24,
                      background: '#FFFFFF',
                      border: `1px solid ${C.border}`,
                      boxShadow: '0 8px 22px rgba(17,28,68,0.04)',
                    }}
                  >
                    <div
                      style={{
                        fontSize: 12,
                        fontWeight: 800,
                        textTransform: 'uppercase',
                        letterSpacing: '0.10em',
                        color: C.text3,
                        marginBottom: 12,
                      }}
                    >
                      Ruin threshold
                    </div>

                    <div
                      style={{
                        fontSize: 28,
                        lineHeight: 1,
                        fontWeight: 800,
                        letterSpacing: '-0.04em',
                        color: C.navy,
                        marginBottom: 8,
                      }}
                    >
                      ${Math.round(results?.ruinThreshold ?? 0).toLocaleString()}
                    </div>

                    <div
                      style={{
                        fontSize: 13,
                        lineHeight: 1.6,
                        color: C.text3,
                      }}
                    >
                      This threshold is currently tied to one month of expenses in your engine settings.
                    </div>
                  </div>
                </div>

                <div
                  style={{
                    padding: '20px 22px',
                    borderRadius: 24,
                    background: '#FFFFFF',
                    border: `1px solid ${C.border}`,
                    boxShadow: '0 8px 22px rgba(17,28,68,0.04)',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 10,
                      marginBottom: 12,
                    }}
                  >
                    <div
                      style={{
                        width: 42,
                        height: 42,
                        borderRadius: 14,
                        background: `linear-gradient(135deg, ${C.accentSoft}, rgba(255,255,255,0.98))`,
                        border: `1px solid ${C.accentGlow}`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <BarChart3 size={20} color={C.navy} />
                    </div>

                    <div>
                      <div
                        style={{
                          fontSize: 12,
                          fontWeight: 800,
                          textTransform: 'uppercase',
                          letterSpacing: '0.10em',
                          color: C.text3,
                          marginBottom: 4,
                        }}
                      >
                        Live engine status
                      </div>

                      <div
                        style={{
                          fontSize: 16,
                          fontWeight: 800,
                          color: C.navy,
                        }}
                      >
                        Connected
                      </div>
                    </div>
                  </div>

                  <div
                    style={{
                      fontSize: 14,
                      lineHeight: 1.7,
                      color: C.text2,
                    }}
                  >
                    This results panel is now connected to your simulation engine and updates automatically whenever the selected scenarios change.
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  )
}

const SCREEN = {
  WELCOME: 'welcome',
  RETURNING: 'returning',
  ONBOARDING: 'onboarding',
  HOME: 'home',
}

export default function App() {
  const profileHook = useProfile()
  const scenariosHook = useScenarios()

  const {
    profile,
    updateProfile,
    isLoggedIn,
    loadDemoProfile,
    completeOnboarding,
    continueAsReturning,
    signOut,
    deleteData,
  } = profileHook

  const [screen, setScreen] = useState(SCREEN.WELCOME)
  const [noAccountFound, setNoAccount] = useState(false)

  function handleGetStarted() {
    setScreen(SCREEN.ONBOARDING)
  }

  function handleBackToWelcome() {
    setScreen(SCREEN.WELCOME)
  }

  function handleSignIn() {
    const saved = storage.loadProfile()
    if (saved?.name) {
      setScreen(SCREEN.RETURNING)
    } else {
      setNoAccount(true)
      setTimeout(() => {
        setNoAccount(false)
        setScreen(SCREEN.ONBOARDING)
      }, 2200)
    }
  }

  function handleUseDemo() {
    loadDemoProfile()
  }

  function handleCompleteOnboarding() {
    completeOnboarding()
  }

  function handleContinueReturning() {
    continueAsReturning()
  }

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
        <div
          style={{
            position: 'fixed',
            bottom: 32,
            left: '50%',
            transform: 'translateX(-50%)',
            background: '#D9B991',
            color: '#0D0C00',
            padding: '12px 24px',
            borderRadius: 100,
            fontSize: 13,
            fontWeight: 700,
            boxShadow: '0 4px 20px rgba(0,0,0,.4)',
            zIndex: 999,
            whiteSpace: 'nowrap',
          }}
        >
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