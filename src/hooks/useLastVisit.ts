import { useState } from "react";

export const useLastVisit = () => {
  const [showWelcome] = useState<boolean>(() => {
    const lastVisit = localStorage.getItem("lastVisitTimestamp");
    const currentTime = new Date().getTime();

    return (
      !lastVisit || currentTime - parseInt(lastVisit) > 24 * 60 * 60 * 1000
    );
  });

  const updateLastVisit = () => {
    localStorage.setItem("lastVisitTimestamp", new Date().getTime().toString());
  };

  return { showWelcome, updateLastVisit };
};
