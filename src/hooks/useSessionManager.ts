import { useEffect, useRef, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

const INACTIVITY_TIMEOUT = 5 * 60 * 1000; // 5 minutes
const SESSION_DURATION = 15 * 60 * 1000; // 15 minutes
const WARNING_BEFORE_EXPIRY = 60 * 1000; // Show warning 60s before session ends

export function useSessionManager() {
  const navigate = useNavigate();
  const [showExtendPrompt, setShowExtendPrompt] = useState(false);
  const inactivityTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const sessionTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const warningTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const sessionStartRef = useRef(Date.now());

  const logout = useCallback(() => {
    sessionStorage.removeItem('entra_user');
    setShowExtendPrompt(false);
    navigate('/', { replace: true });
  }, [navigate]);

  const resetInactivityTimer = useCallback(() => {
    if (inactivityTimer.current) clearTimeout(inactivityTimer.current);
    inactivityTimer.current = setTimeout(() => {
      logout();
    }, INACTIVITY_TIMEOUT);
  }, [logout]);

  const startSessionTimer = useCallback(() => {
    sessionStartRef.current = Date.now();

    if (warningTimer.current) clearTimeout(warningTimer.current);
    if (sessionTimer.current) clearTimeout(sessionTimer.current);

    // Show extend prompt 60s before session expires
    warningTimer.current = setTimeout(() => {
      setShowExtendPrompt(true);
    }, SESSION_DURATION - WARNING_BEFORE_EXPIRY);

    // Force logout when session expires
    sessionTimer.current = setTimeout(() => {
      logout();
    }, SESSION_DURATION);
  }, [logout]);

  const extendSession = useCallback(() => {
    setShowExtendPrompt(false);
    startSessionTimer();
    resetInactivityTimer();
  }, [startSessionTimer, resetInactivityTimer]);

  useEffect(() => {
    // Check if user is authenticated
    const user = sessionStorage.getItem('entra_user');
    if (!user) {
      navigate('/', { replace: true });
      return;
    }

    startSessionTimer();
    resetInactivityTimer();

    const activityEvents = ['mousedown', 'keydown', 'touchstart', 'scroll', 'mousemove'];
    const handleActivity = () => resetInactivityTimer();

    activityEvents.forEach((e) => window.addEventListener(e, handleActivity, { passive: true }));

    return () => {
      activityEvents.forEach((e) => window.removeEventListener(e, handleActivity));
      if (inactivityTimer.current) clearTimeout(inactivityTimer.current);
      if (sessionTimer.current) clearTimeout(sessionTimer.current);
      if (warningTimer.current) clearTimeout(warningTimer.current);
    };
  }, [navigate, startSessionTimer, resetInactivityTimer]);

  return { showExtendPrompt, extendSession, logout };
}
