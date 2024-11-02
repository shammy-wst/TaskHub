import { useState } from "react";

export const useLastVisit = () => {
  const [showWelcome, setShowWelcome] = useState<boolean>(() => {
    const lastVisit = localStorage.getItem("lastVisitTimestamp");
    const currentTime = new Date().getTime();
    const EIGHT_HOURS = 8 * 60 * 60 * 1000; // 8 heures en millisecondes

    return !lastVisit || currentTime - parseInt(lastVisit) > EIGHT_HOURS;
  });

  const updateLastVisit = () => {
    localStorage.setItem("lastVisitTimestamp", new Date().getTime().toString());
    setShowWelcome(false);
  };

  return { showWelcome, updateLastVisit };
};
