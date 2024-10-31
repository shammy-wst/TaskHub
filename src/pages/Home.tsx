import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchTasks, createTask } from "../features/taskSlice";
import TaskList from "../components/TaskList";
import { RootState, AppDispatch } from "../app/store";
import { useNavigate } from "react-router-dom";

const Home: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const tasks = useSelector((state: RootState) => state.tasks.items);
  const taskStatus = useSelector((state: RootState) => state.tasks.status);
  const error = useSelector((state: RootState) => state.tasks.error);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [formError, setFormError] = useState<string | null>(null);

  useEffect(() => {
    console.log("Home: useEffect déclenché");
    const token = localStorage.getItem("authToken");

    if (!token) {
      console.log("Pas de token, redirection vers login");
      navigate("/login");
      return;
    }

    if (taskStatus === "idle") {
      console.log("Déclenchement de fetchTasks");
      dispatch(fetchTasks())
        .unwrap()
        .catch((error) => {
          console.error("Erreur lors du chargement des tâches:", error);
          if (error.message.includes("Non authentifié")) {
            navigate("/login");
          }
        });
    }
  }, [taskStatus, dispatch, navigate]);

  const handleAddTask = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("handleAddTask déclenché");
    setFormError(null);

    if (!title.trim() || !description.trim()) {
      setFormError("Le titre et la description sont requis");
      return;
    }

    try {
      console.log("Création de la tâche:", { title, description });
      await dispatch(
        createTask({
          title: title.trim(),
          description: description.trim(),
          status: "incomplete", // Statut par défaut
        })
      ).unwrap();

      console.log("Tâche créée avec succès");
      setTitle("");
      setDescription("");

      // Recharger la liste des tâches
      dispatch(fetchTasks());
    } catch (error) {
      console.error("Erreur lors de la création de la tâche:", error);
      setFormError(
        error instanceof Error
          ? error.message
          : "Erreur lors de la création de la tâche"
      );
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">
        TaskHub - Page d'accueil
      </h1>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">
          Ajouter une nouvelle tâche
        </h2>
        <form
          onSubmit={handleAddTask}
          className="bg-white p-4 rounded-lg shadow-md"
        >
          <input
            type="text"
            placeholder="Titre de la tâche"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-2 mb-4 border border-gray-300 rounded-md"
            required
          />
          <textarea
            placeholder="Description de la tâche"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full p-2 mb-4 border border-gray-300 rounded-md h-32"
            required
          />
          {formError && (
            <div className="text-red-500 mb-4 text-sm">{formError}</div>
          )}
          <button
            type="submit"
            className="w-full bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 transition-colors"
            disabled={taskStatus === "loading"}
          >
            {taskStatus === "loading"
              ? "Création en cours..."
              : "Ajouter la tâche"}
          </button>
        </form>
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-4">Liste des tâches</h2>
        {taskStatus === "loading" && (
          <div className="text-center p-4">
            <p className="text-gray-500">Chargement des tâches...</p>
          </div>
        )}
        {taskStatus === "failed" && (
          <div className="text-center p-4 text-red-500">Erreur: {error}</div>
        )}
        {taskStatus === "succeeded" && tasks.length === 0 ? (
          <p className="text-gray-500 text-center p-4">
            Aucune tâche disponible pour le moment. Ajoutez une nouvelle tâche
            pour commencer.
          </p>
        ) : (
          <TaskList />
        )}
      </section>
    </div>
  );
};

export default Home;
