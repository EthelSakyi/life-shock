import { useState, useEffect, useCallback } from 'react';
import { storage } from '../services/storage';
import { DEMO_PROFILE } from '../data/demoProfile';

// Default empty profile — matches runSimulation() input schema
const DEFAULT_PROFILE = {
  name: '',
  age: '',
  email: '',
  income: '',
  expenses: '',
  savings: '',
  debt: '',
  employment: 'employed', // matches Phase 2: 'employed' | 'freelance' | 'student'
};

export function useProfile() {
  const [profile, setProfile] = useState(DEFAULT_PROFILE);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isReturning, setIsReturning] = useState(false);

  // On mount — check for returning user
  useEffect(() => {
    const savedProfile = storage.loadProfile();
    const savedSession = storage.loadSession();

    if (savedProfile) {
      setProfile(savedProfile);
      setIsReturning(true);
    }
    if (savedSession?.loggedIn) {
      setIsLoggedIn(true);
    }
  }, []);

  // Auto-save profile on every change
  useEffect(() => {
    if (profile.name || profile.income) {
      storage.saveProfile(profile);
    }
  }, [profile]);

  const updateProfile = useCallback((updates) => {
    setProfile((prev) => ({ ...prev, ...updates }));
  }, []);

  // Load Alex demo — skips all setup
  const loadDemoProfile = useCallback(() => {
    setProfile(DEMO_PROFILE);
    setIsLoggedIn(true);
    storage.saveProfile(DEMO_PROFILE);
    storage.saveSession({ loggedIn: true });
  }, []);

  // Called when user completes onboarding form
  const completeOnboarding = useCallback(() => {
    setIsLoggedIn(true);
    storage.saveSession({ loggedIn: true });
  }, []);

  // Called when returning user hits "Continue"
  const continueAsReturning = useCallback(() => {
    setIsLoggedIn(true);
    storage.saveSession({ loggedIn: true });
  }, []);

  // Sign out — clears session, profile stays in localStorage
  const signOut = useCallback(() => {
    setIsLoggedIn(false);
    storage.clearSession();
  }, []);

  // Delete my data — wipes everything, resets to blank
  const deleteData = useCallback(() => {
    setProfile(DEFAULT_PROFILE);
    setIsLoggedIn(false);
    setIsReturning(false);
    storage.clearAll();
  }, []);

  return {
    profile,
    updateProfile,
    isLoggedIn,
    isReturning,
    loadDemoProfile,
    completeOnboarding,
    continueAsReturning,
    signOut,
    deleteData,
  };
}