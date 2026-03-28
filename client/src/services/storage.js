const KEYS = {
  PROFILE: 'lifeshock_profile',
  SESSION: 'lifeshock_session',
};

export const storage = {
  saveProfile(profile) {
    try {
      localStorage.setItem(KEYS.PROFILE, JSON.stringify(profile));
    } catch (e) {
      console.warn('LifeShock: could not save profile', e);
    }
  },

  loadProfile() {
    try {
      const raw = localStorage.getItem(KEYS.PROFILE);
      return raw ? JSON.parse(raw) : null;
    } catch (e) {
      return null;
    }
  },

  saveSession(session) {
    try {
      localStorage.setItem(KEYS.SESSION, JSON.stringify(session));
    } catch (e) {
      console.warn('LifeShock: could not save session', e);
    }
  },

  loadSession() {
    try {
      const raw = localStorage.getItem(KEYS.SESSION);
      return raw ? JSON.parse(raw) : null;
    } catch (e) {
      return null;
    }
  },

  // Sign out — clears session but keeps profile
  clearSession() {
    try {
      localStorage.removeItem(KEYS.SESSION);
    } catch (e) {
      console.warn('LifeShock: could not clear session', e);
    }
  },

  // Delete my data — wipes everything
  clearAll() {
    try {
      localStorage.removeItem(KEYS.PROFILE);
      localStorage.removeItem(KEYS.SESSION);
    } catch (e) {
      console.warn('LifeShock: could not clear storage', e);
    }
  },

  hasProfile() {
    return !!localStorage.getItem(KEYS.PROFILE);
  },

  hasSession() {
    return !!localStorage.getItem(KEYS.SESSION);
  },
};