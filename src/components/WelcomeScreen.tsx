"use client";

import React, { useEffect } from "react";
import taskHubGif from "../assets/cube.gif";

interface WelcomeScreenProps {
  onComplete: () => void;
}

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onComplete }) => {
  useEffect(() => {
    const checkLastVisit = () => {
      const lastVisit = localStorage.getItem("lastVisitTimestamp");
      const currentTime = new Date().getTime();

      // Si jamais visité ou si la dernière visite date de plus de 24h
      if (
        !lastVisit ||
        currentTime - parseInt(lastVisit) > 24 * 60 * 60 * 1000
      ) {
        return true;
      }
      return false;
    };

    // Si déjà visité récemment, on skip le welcome screen
    if (!checkLastVisit()) {
      onComplete();
    }

    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.code === "Space") {
        localStorage.setItem(
          "lastVisitTimestamp",
          new Date().getTime().toString()
        );
        onComplete();
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [onComplete]);

  return (
    <div
      className="fixed inset-0 bg-black z-50 flex flex-col items-center justify-center"
      tabIndex={0}
    >
      <div className="text-center space-y-8 max-w-2xl px-4">
        <img src={taskHubGif} alt="TaskHub" className="h-16 md:h-20 mx-auto" />

        <div className="text-white text-lg">
          Press{" "}
          <span className="border-[3px] border-white rounded-lg px-4 py-1">
            SPACE
          </span>{" "}
          to continue
        </div>

        <div className="mt-12 text-sm text-zinc-400 p-6 bg-black/50">
          <span className="text-yellow-500 font-bold">WARNING:</span> This
          application is designed to improve your
          <span className="text-green-400"> productivity</span>. Extended
          exposure may result in increased
          <span className="text-blue-400"> efficiency</span> and better
          <span className="text-purple-400"> time management</span>.
          <br />
          <br />
          TaskHub is <span className="text-red-400">not responsible</span> for
          any
          <span className="text-green-400"> success</span> that may occur during
          its use.
        </div>
      </div>
    </div>
  );
};

export default WelcomeScreen;
