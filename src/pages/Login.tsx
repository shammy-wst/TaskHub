import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { useSound } from "../hooks/useSound";
import cubeGif from "../assets/cube.gif";
import { API_URL } from "../features/taskSlice";

const Login: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { playClickSound } = useSound();

  const clearForm = () => {
    setUsername("");
    setPassword("");
    setConfirmPassword("");
    setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    playClickSound();
    setError("");

    // Validation basique
    if (username.length < 3) {
      setError("Username must be at least 3 characters long");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters long");
      return;
    }

    if (!isLogin && password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      const endpoint = isLogin ? "login" : "register";
      const response = await fetch(`${API_URL}/api/auth/${endpoint}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Erreur d'authentification");
      }

      if (data.token) {
        // Stocker le token
        localStorage.setItem("authToken", data.token);

        // Stocker le nom d'utilisateur
        localStorage.setItem("username", username);

        // Afficher un message de succès (optionnel)
        const message = isLogin
          ? "Login successful"
          : "Account created successfully";
        console.log(message);

        // Redirection
        navigate("/");
      } else {
        setError(data.message || "Erreur d'authentification");
      }
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("Erreur de connexion au serveur");
      }
    }
  };

  const toggleMode = () => {
    playClickSound();
    setIsLogin(!isLogin);
    clearForm();
  };

  return (
    <div className="min-h-screen flex flex-col bg-black text-white">
      <Header />

      {/* Background avec cube */}
      <div className="fixed inset-0 z-0 opacity-20">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url(${cubeGif})`,
            backgroundSize: "25%",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
          }}
        />
      </div>

      {/* Contenu principal */}
      <main className="flex-1 flex items-center justify-center p-8 relative z-10">
        <div className="w-full max-w-md">
          <div className="flex flex-col items-center mb-8">
            <h2 className="text-3xl font-bold">
              {isLogin ? "Access Portal" : "Initialize Account"}
            </h2>
            <div className="flex items-center gap-4 mt-4">
              <button
                onClick={() => isLogin || toggleMode()}
                className={`px-4 py-2 rounded-lg transition-all duration-200
                  ${
                    isLogin
                      ? "bg-white/10 text-white border-[3px] border-white"
                      : "text-white/50 hover:text-white"
                  }`}
              >
                Login
              </button>
              <button
                onClick={() => !isLogin || toggleMode()}
                className={`px-4 py-2 rounded-lg transition-all duration-200
                  ${
                    !isLogin
                      ? "bg-white/10 text-white border-[3px] border-white"
                      : "text-white/50 hover:text-white"
                  }`}
              >
                Register
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            <div className="flex flex-col gap-2">
              <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="bg-black/50 border-[3px] border-white/50 rounded-lg p-4 
                         text-white placeholder-white/50 focus:border-white
                         transition-colors duration-200"
                required
                minLength={3}
              />
            </div>

            <div className="flex flex-col gap-2">
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-black/50 border-[3px] border-white/50 rounded-lg p-4 
                         text-white placeholder-white/50 focus:border-white
                         transition-colors duration-200"
                required
                minLength={6}
              />
            </div>

            {!isLogin && (
              <div className="flex flex-col gap-2">
                <input
                  type="password"
                  placeholder="Confirm Password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="bg-black/50 border-[3px] border-white/50 rounded-lg p-4 
                           text-white placeholder-white/50 focus:border-white
                           transition-colors duration-200"
                  required
                  minLength={6}
                />
              </div>
            )}

            <button
              type="submit"
              className="relative border-[3px] border-white rounded-lg px-6 py-4 
                       hover:bg-white hover:text-black transition-all duration-200
                       flex items-center justify-center gap-2 group mt-4 overflow-hidden"
            >
              <span className="relative z-10">
                {isLogin ? "Initialize Session" : "Create Account"}
              </span>
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div
                  className="absolute inset-0 bg-white"
                  style={{
                    backgroundImage: `url(${cubeGif})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    opacity: 0.1,
                  }}
                />
              </div>
            </button>
          </form>

          {error && (
            <div
              className="mt-6 text-red-500 text-center bg-red-500/10 
                          border-2 border-red-500 rounded-lg p-4"
            >
              {error}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Login;
