import clickSound from "../assets/sounds/click.mp3";

export const useSound = () => {
  const playClickSound = () => {
    const audio = new Audio(clickSound);
    audio.volume = 0.5;
    audio.play().catch(() => {});
  };

  return { playClickSound };
};
