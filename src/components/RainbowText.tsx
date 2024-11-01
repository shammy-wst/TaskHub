import React from "react";

interface RainbowTextProps {
  children: React.ReactNode;
}

const RainbowText: React.FC<RainbowTextProps> = ({ children }) => {
  return (
    <span className="bg-gradient-to-r from-red-500 via-purple-500 to-blue-500 text-transparent bg-clip-text animate-gradient">
      {children}
    </span>
  );
};

export default RainbowText;
