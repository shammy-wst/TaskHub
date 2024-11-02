import React, { useEffect, useState, useCallback } from "react";
import cubeGif from "../assets/cube.gif";
import clickSound from "../assets/sounds/click.mp3";

interface WelcomeScreenProps {
  onComplete: () => void;
}

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onComplete }) => {
  const [soundEnabled, setSoundEnabled] = useState(false);

  const playClickSound = useCallback(() => {
    if (soundEnabled) {
      const audio = new Audio(clickSound);
      audio.volume = 0.5;
      audio.play().catch(() => {});
    }
  }, [soundEnabled]);

  const handleComplete = useCallback(() => {
    playClickSound();
    localStorage.setItem("lastVisitTimestamp", new Date().getTime().toString());
    onComplete();
  }, [onComplete, playClickSound]);

  const handleEnableSound = async () => {
    try {
      // Jouer un son test immédiatement avec un volume très bas
      const testAudio = new Audio(clickSound);
      testAudio.volume = 0.1;
      await testAudio.play();

      // Si on arrive ici, le son est autorisé
      setSoundEnabled(true);

      // Attendre un court instant puis arrêter le son test
      setTimeout(() => {
        testAudio.pause();
        testAudio.currentTime = 0;
      }, 100);
    } catch (error) {
      console.error("Impossible d'activer le son:", error);
      // Optionnel : Afficher un message à l'utilisateur
      alert(
        "Please enable sound in your browser settings to continue with audio."
      );
    }
  };

  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.code === "Space") {
        handleComplete();
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [handleComplete]);

  return (
    <div className="fixed inset-0 bg-black z-50 flex items-center justify-center">
      <div className="flex flex-col items-center gap-12 max-w-2xl">
        <img src={cubeGif} alt="TaskHub" className="h-32 md:h-40 lg:h-48" />

        {!soundEnabled ? (
          <button
            onClick={handleEnableSound}
            className="text-white border-2 border-white/50 bg-white/10 rounded px-4 py-2 hover:bg-white hover:text-black transition-colors duration-200 flex items-center gap-2"
          >
            <span>🔇</span> Enable Sound
          </button>
        ) : (
          <div className="text-green-400 flex items-center gap-2">
            <span>🔊</span> Sound Enabled
          </div>
        )}

        <div className="text-white text-lg animate-pulse flex items-center gap-3">
          Press
          <button
            onClick={handleComplete}
            className="border-2 border-white/50 bg-white/10 rounded-lg px-3 py-1 font-mono text-sm
                     hover:bg-white hover:text-black transition-colors duration-200 cursor-pointer"
          >
            SPC
          </button>
          to continue
        </div>

        <div className="flex flex-col gap-4 text-sm text-zinc-400 bg-black/50 border border-zinc-800 rounded-lg p-6">
          <div>
            <span className="text-yellow-500 font-bold">WARNING:</span> This
            application is designed to improve your
            <span className="text-green-400"> productivity</span>. Extended
            exposure may result in increased
            <span className="text-blue-400"> efficiency</span> and better
            <span className="text-purple-400"> time management</span>.
          </div>

          <div>
            TaskHub is <span className="text-red-400">not responsible</span> for
            any
            <span className="text-green-400"> success</span> that may occur
            during its use.
          </div>
        </div>
      </div>
    </div>
  );
};

export default WelcomeScreen;
