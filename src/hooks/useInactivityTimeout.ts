import { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { resetTasks } from "../features/taskSlice";

const INACTIVITY_TIMEOUT = 15 * 60 * 1000; // 15 minutes
const WARNING_DURATION = 5 * 1000; // 5 secondes d'avertissement

export const useInactivityTimeout = () => {
  const [showModal, setShowModal] = useState(false);
  const [timeLeft, setTimeLeft] = useState(5);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Ajout des refs manquantes
  const isTimerActive = useRef(false);
  const inactivityTimerRef = useRef<NodeJS.Timeout>();
  const countdownIntervalRef = useRef<NodeJS.Timeout>();

  const logout = useCallback(() => {
    setShowModal(false);
    localStorage.removeItem("authToken");
    dispatch(resetTasks());
    isTimerActive.current = false;
    navigate("/login", { replace: true });
  }, [navigate, dispatch]);

  const clearAllTimers = useCallback(() => {
    if (inactivityTimerRef.current) clearTimeout(inactivityTimerRef.current);
    if (countdownIntervalRef.current)
      clearInterval(countdownIntervalRef.current);
  }, []);

  const startInactivityTimer = useCallback(() => {
    if (isTimerActive.current) return;

    clearAllTimers();
    isTimerActive.current = true;

    inactivityTimerRef.current = setTimeout(() => {
      setShowModal(true);
      setTimeLeft(5);

      countdownIntervalRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(countdownIntervalRef.current);
            logout();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }, INACTIVITY_TIMEOUT - WARNING_DURATION);
  }, [clearAllTimers, logout]);

  const resetTimer = useCallback(() => {
    clearAllTimers();
    setShowModal(false);
    setTimeLeft(5);
    isTimerActive.current = false;
    startInactivityTimer();
  }, [clearAllTimers, startInactivityTimer]);

  useEffect(() => {
    const handleActivity = () => {
      if (!showModal) {
        startInactivityTimer();
      }
    };

    const events = [
      "mousedown",
      "keydown",
      "mousemove",
      "touchstart",
      "scroll",
    ];
    events.forEach((event) => document.addEventListener(event, handleActivity));

    if (localStorage.getItem("authToken")) {
      startInactivityTimer();
    }

    return () => {
      events.forEach((event) =>
        document.removeEventListener(event, handleActivity)
      );
      clearAllTimers();
    };
  }, [showModal, startInactivityTimer, clearAllTimers]);

  return { showModal, timeLeft, resetTimer };
};
