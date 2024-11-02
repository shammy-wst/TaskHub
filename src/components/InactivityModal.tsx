import React from "react";
import cubeGif from "../assets/cube.gif";
import { useSound } from "../hooks/useSound";

interface InactivityModalProps {
  onClose: () => void;
  timeLeft: number;
}

const InactivityModal: React.FC<InactivityModalProps> = ({
  onClose,
  timeLeft,
}) => {
  const { playClickSound } = useSound();

  const handleStayConnected = () => {
    playClickSound();
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-black border-[3px] border-white rounded-lg p-8 max-w-md w-full relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `url(${cubeGif})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          />
        </div>

        <div className="relative z-10">
          <h2 className="text-2xl font-bold text-white mb-4">
            ⚠️ Inactivity Alert
          </h2>
          <p className="text-zinc-300 mb-8">
            Session timeout imminent. You will be automatically logged out in{" "}
            <span className="text-red-500 font-bold">{timeLeft}</span> seconds
            due to inactivity.
          </p>
          <div className="flex justify-center">
            <button onClick={handleStayConnected} className="relative group">
              {/* Cercles pulsants */}
              <div className="absolute inset-0 animate-ping bg-white/30 rounded-lg group-hover:bg-white/50" />
              <div className="absolute inset-0 animate-pulse bg-white/20 rounded-lg group-hover:bg-white/40" />

              {/* Bouton principal */}
              <div
                className="relative border-[3px] border-white rounded-lg px-8 py-3
                          bg-gradient-to-r from-purple-500/20 via-blue-500/20 to-green-500/20
                          hover:from-purple-500 hover:via-blue-500 hover:to-green-500
                          transition-all duration-300 transform hover:scale-105"
              >
                <span className="text-lg font-bold text-white group-hover:text-white/90">
                  › Stay Connected _
                </span>

                {/* Effet de brillance */}
                <div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent
                            translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"
                />
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InactivityModal;
