import React from "react";
import { SignOut } from "@phosphor-icons/react";
import { useNavigate } from "react-router-dom";
import taskHubGif from "../assets/cube.gif";
import { useSound } from "../hooks/useSound";

const Header: React.FC = () => {
  const navigate = useNavigate();
  const { playClickSound } = useSound();
  const token = localStorage.getItem("authToken");

  const handleLogout = () => {
    playClickSound();
    localStorage.removeItem("authToken");
    navigate("/login");
  };

  const handleLogoClick = () => {
    playClickSound();
    navigate("/");
  };

  return (
    <header className="bg-black h-14 flex items-center z-50 w-full">
      <button
        onClick={handleLogoClick}
        className="ml-4 hover:opacity-80 transition-opacity"
      >
        <img src={`${taskHubGif}?v=1`} alt="TaskHub" className="h-8" />
      </button>
      <div className="flex-1" />
      {token && (
        <button
          onClick={handleLogout}
          className="text-zinc-400 hover:text-white transition-colors mr-4"
        >
          <SignOut size={24} weight="bold" />
        </button>
      )}
    </header>
  );
};

export default Header;
