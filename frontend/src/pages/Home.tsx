import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchTasks, addTask } from "../features/taskSlice";
import TaskList from "../components/TaskList";
import { RootState, AppDispatch } from "../app/store";

const Home: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const tasks = useSelector((state: RootState) => state.tasks.items);
  const taskStatus = useSelector((state: RootState) => state.tasks.status);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    if (taskStatus === "idle") {
      dispatch(fetchTasks());
    }
  }, [taskStatus, dispatch]);

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (title && description) {
      const newTask = {
        id: tasks.length + 1,
        title,
        description,
        status: "pending",
      };
      dispatch(addTask(newTask));
      setTitle("");
      setDescription("");
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
            className="w-full p-2 mb-4 border border-gray-300 rounded-md"
            required
          />
          <button
            type="submit"
            className="w-full bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600"
          >
            Ajouter la tâche
          </button>
        </form>
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-4">Liste des tâches</h2>
        {taskStatus === "loading" && <p>Chargement des tâches...</p>}
        {taskStatus === "failed" && (
          <p>Erreur lors du chargement des tâches.</p>
        )}
        {tasks.length > 0 ? (
          <TaskList />
        ) : (
          <p className="text-gray-500">
            Aucune tâche disponible pour le moment. Ajoutez une nouvelle tâche
            pour commencer.
          </p>
        )}
      </section>
    </div>
  );
};

export default Home;
