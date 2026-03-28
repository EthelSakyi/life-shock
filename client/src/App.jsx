// client/src/App.jsx
import React, { useState } from 'react';
import { useProfile } from './hooks/useProfile';
import { storage } from './services/storage';
import WelcomeScreen     from './components/onboarding/WelcomeScreen';
import ProfileForm       from './components/onboarding/ProfileForm';
import ReturningUserCard from './components/onboarding/ReturningUserCard';

// ─── Phase 4 placeholder ──────────────────────────────────────────
function HomeDashboard({ profile, onSignOut }) {
  return (
    <div style={{
      minHeight: '100vh', background: '#f8f9ff', color: '#0f1235',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      flexDirection: 'column', gap: 12, fontFamily: 'inherit', padding: 24,
    }}>
      <div style={{ fontSize: 24, fontWeight: 800, letterSpacing: '-0.5px', marginBottom: 8 }}>
        Life<span style={{ color: '#131936' }}>Shock</span>
      </div>
      <h1 style={{ fontSize: 32, fontWeight: 800, letterSpacing: '-1px', color: '#0f1235', textAlign: 'center' }}>
        Hi {profile.name}, what would you like to do?
      </h1>
      <p style={{ color: '#8b91b8', fontSize: 14 }}>Phase 4 home dashboard coming soon</p>
      <p style={{ color: '#b0b5d0', fontSize: 12, fontFamily: "'DM Mono', monospace" }}>
        income: ${Number(profile.income).toLocaleString()} &nbsp;|&nbsp;
        expenses: ${Number(profile.expenses).toLocaleString()} &nbsp;|&nbsp;
        savings: ${Number(profile.savings).toLocaleString()}
      </p>
      <button onClick={onSignOut} style={{
        marginTop: 16, padding: '10px 28px', borderRadius: 100,
        background: '#131936', color: '#fff', border: 'none', cursor: 'pointer',
        fontFamily: 'inherit', fontSize: 13, fontWeight: 600,
        boxShadow: '0 2px 10px rgba(19,25,54,.2)',
      }}>
        Sign out
      </button>
    </div>
  );
}

// ─── Screens enum ─────────────────────────────────────────────────
const SCREEN = {
  WELCOME:   'welcome',
  RETURNING: 'returning',
  ONBOARDING:'onboarding',
  HOME:      'home',
};

// ─── App ──────────────────────────────────────────────────────────
export default function App() {
  const {
    profile,
    updateProfile,
    isLoggedIn,
    loadDemoProfile,
    completeOnboarding,
    continueAsReturning,
    signOut,
    deleteData,
  } = useProfile();

  const [screen, setScreen]           = useState(SCREEN.WELCOME);
  const [noAccountFound, setNoAccount] = useState(false);

  // Once logged in always show home regardless of screen state
  if (isLoggedIn) {
    return <HomeDashboard profile={profile} onSignOut={handleSignOut} />;
  }

  // ── Handlers ──────────────────────────────────────────────────

  function handleGetStarted() {
    setScreen(SCREEN.ONBOARDING);
  }

  function handleSignIn() {
    const saved = storage.loadProfile();
    if (saved?.name) {
      // Has a saved profile → show welcome back
      setScreen(SCREEN.RETURNING);
    } else {
      // No profile found → toast then redirect to form
      setNoAccount(true);
      setTimeout(() => {
        setNoAccount(false);
        setScreen(SCREEN.ONBOARDING);
      }, 2200);
    }
  }

  function handleUseDemo() {
    loadDemoProfile(); // sets isLoggedIn = true → auto-renders HomeDashboard
  }

  function handleCompleteOnboarding() {
    completeOnboarding(); // sets isLoggedIn = true → auto-renders HomeDashboard
  }

  function handleContinueReturning() {
    continueAsReturning(); // sets isLoggedIn = true → auto-renders HomeDashboard
  }

  function handleSignOut() {
    signOut();
    setScreen(SCREEN.WELCOME);
  }

  function handleDeleteData() {
    deleteData();
    setScreen(SCREEN.WELCOME);
  }

  function handleBackToWelcome() {
    setScreen(SCREEN.WELCOME);
  }

  // ── Routing ───────────────────────────────────────────────────

  if (screen === SCREEN.RETURNING) {
    return (
      <ReturningUserCard
        profile={profile}
        onContinue={handleContinueReturning}
        onSignOut={handleSignOut}
        onDeleteData={handleDeleteData}
        onBackToWelcome={handleBackToWelcome}
      />
    );
  }

  if (screen === SCREEN.ONBOARDING) {
    return (
      <ProfileForm
        profile={profile}
        onUpdate={updateProfile}
        onComplete={handleCompleteOnboarding}
        onUseDemo={handleUseDemo}
      />
    );
  }

  // Default — WELCOME (everyone starts here)
  return (
    <>
      {noAccountFound && (
        <div style={{
          position: 'fixed', bottom: 32, left: '50%',
          transform: 'translateX(-50%)',
          background: '#0f1235', color: '#fff',
          padding: '12px 24px', borderRadius: 100,
          fontSize: 13, fontWeight: 600,
          boxShadow: '0 4px 20px rgba(0,0,0,.3)',
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
  );
}
