import React from "react";
import { SignOut } from "@phosphor-icons/react";
import { useNavigate } from "react-router-dom";
import taskHubGif from "../assets/cube.gif";

const Header: React.FC = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("authToken");

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    navigate("/login");
  };

  return (
    <header className="bg-black h-14 flex items-center z-50 w-full">
      <img src={taskHubGif} alt="TaskHub" className="h-8 ml-4" />
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
