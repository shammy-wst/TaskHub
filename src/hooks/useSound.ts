import { useCallback } from "react";

export const useSound = () => {
  const playClickSound = useCallback(() => {
    const audio = new Audio();
    audio.volume = 0.5;
    audio.play().catch(() => {});
  }, []);

  return { playClickSound };
};
