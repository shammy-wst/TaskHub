import React from "react";
import RainbowText from "./RainbowText";

const Footer: React.FC = () => {
  return (
    <footer className="fixed bottom-0 left-0 right-0 z-50 bg-black border-t-[3px] border-white py-4 md:py-6">
      <div className="mb-1 md:mb-2 text-sm md:text-base">Icham M'MADI</div>
      <RainbowText>
        <span className="text-sm md:text-base">Creative Web Developer</span>
      </RainbowText>
    </footer>
  );
};

export default Footer;
