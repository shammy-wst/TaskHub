import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:3001";

const Login: React.FC = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API_URL}/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }), // Inclure les identifiants dans la requête
      });

      const data = await response.json();
      console.log("Réponse de l'API:", data); // Ajoutez ce log pour vérifier la réponse

      if (data.token) {
        localStorage.setItem("authToken", data.token);
        navigate("/");
      } else {
        setError("Erreur lors de la connexion");
      }
    } catch (error) {
      console.error("Erreur lors de la connexion au serveur:", error); // Ajoutez ce log pour vérifier les erreurs
      setError("Erreur lors de la connexion au serveur");
    }
  };

  return (
    <div className="container mx-auto p-6 flex flex-col items-center">
      <h2 className="text-3xl font-bold mb-6">Connexion</h2>
      <form
        onSubmit={handleLogin}
        className="bg-white p-6 rounded-lg shadow-md w-full max-w-sm"
      >
        <input
          type="text"
          placeholder="Nom d'utilisateur"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full p-2 mb-4 border border-gray-300 rounded-md"
          required
        />
        <input
          type="password"
          placeholder="Mot de passe"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-2 mb-4 border border-gray-300 rounded-md"
          required
        />
        <button
          type="submit"
          className="w-full bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600"
        >
          Se connecter
        </button>
      </form>

      {error && <p className="text-red-500 mt-4">{error}</p>}
    </div>
  );
};

export default Login;
