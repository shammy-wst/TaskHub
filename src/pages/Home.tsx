import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchTasks, createTask } from "../features/taskSlice";
import TaskItem from "../components/TaskItem";
import { RootState, AppDispatch } from "../app/store";
import { useNavigate } from "react-router-dom";
import WelcomeScreen from "../components/WelcomeScreen";
import RainbowText from "../components/RainbowText";
import cubeGif from "../assets/cube.gif";
import galaxyGif from "../assets/galaxy.gif";
import fujiGif from "../assets/fuji.gif";

const Home: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const tasks = useSelector((state: RootState) => state.tasks.items);
  const taskStatus = useSelector((state: RootState) => state.tasks.status);
  const error = useSelector((state: RootState) => state.tasks.error);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [formError, setFormError] = useState<string | null>(null);
  const [showWelcome, setShowWelcome] = useState<boolean>(() => {
    const lastVisit = localStorage.getItem("lastVisitTimestamp");
    const currentTime = new Date().getTime();

    // Si jamais visité ou si la dernière visite date de plus de 24h
    if (!lastVisit || currentTime - parseInt(lastVisit) > 24 * 60 * 60 * 1000) {
      return true;
    }
    return false;
  });

  React.useEffect(() => {
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
      setFormError("Title and description are required");
      return;
    }

    try {
      console.log("Création de la tâche:", { title, description });
      await dispatch(
        createTask({
          title: title.trim(),
          description: description.trim(),
          status: "en_attente",
        })
      ).unwrap();

      console.log("Tâche créée avec succès");
      setTitle("");
      setDescription("");

      dispatch(fetchTasks());
    } catch (error) {
      console.error("Erreur lors de la création de la tâche:", error);
      setFormError(
        error instanceof Error ? error.message : "Error while creating the task"
      );
    }
  };

  return (
    <>
      {showWelcome && (
        <WelcomeScreen onComplete={() => setShowWelcome(false)} />
      )}

      <main
        className="flex-1 lg:overflow-hidden relative"
        style={{ background: "black" }}
      >
        <div
          className="absolute inset-0 z-0 opacity-20"
          style={{
            backgroundImage: `url(${cubeGif})`,
            backgroundSize: "30%",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
          }}
        />

        <div className="relative z-10 h-full max-w-5xl mx-auto flex items-center">
          <div className="flex flex-col lg:flex-row w-full gap-8">
            {/* Left column */}
            <div className="flex flex-col lg:w-1/3 gap-8">
              {/* Task Form */}
              <div className="border-[3px] border-white p-6 flex flex-col gap-4">
                <div className="flex items-center gap-2">
                  <span className="animate-pulse text-green-500 text-xl">
                    ›
                  </span>
                  <h2 className="font-mono text-xl tracking-wider">
                    <span className="text-blue-400">new</span>
                    <span className="text-purple-400">.</span>
                    <span className="text-green-400">task</span>
                    <span className="text-white animate-blink">_</span>
                  </h2>
                </div>
                <form className="flex flex-col gap-4" onSubmit={handleAddTask}>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Task title"
                    className="w-full border-[3px] border-white p-3 focus:outline-none focus:border-blue-500 transition-colors placeholder-zinc-500 bg-black text-white"
                  />
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Description"
                    className="w-full border-[3px] border-white p-3 focus:outline-none focus:border-blue-500 transition-colors placeholder-zinc-500 bg-black text-white min-h-[120px] resize-none"
                  />
                  {formError && (
                    <div className="text-red-500 text-sm">{formError}</div>
                  )}
                  <button
                    type="submit"
                    className="relative w-full border-[3px] border-white p-3 text-white group"
                  >
                    <span className="relative z-10 group-hover:opacity-0 transition-opacity duration-200">
                      Add Task
                    </span>
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <img
                        src={fujiGif}
                        alt=""
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </button>
                </form>
              </div>

              {/* About section */}
              <div className="border-[3px] border-white p-6 lg:block">
                <div className="flex flex-col gap-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-bold text-white font-mono">
                      About TaskHub
                    </h3>
                    <button
                      onClick={() => navigate("/about")}
                      className="relative border-[3px] border-white px-4 py-2 text-white transition-all duration-200 font-mono text-sm flex items-center gap-2 group"
                    >
                      <span className="relative z-10 group-hover:opacity-0 transition-opacity duration-200">
                        Discover our story
                      </span>
                      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <img
                          src={galaxyGif}
                          alt=""
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Right column */}
            <div className="lg:w-2/3">
              <div className="border-[3px] border-white p-6 h-fit">
                <div className="flex flex-col gap-4">
                  <h2 className="text-xl font-bold text-white">My Tasks</h2>
                  <div
                    className="lg:max-h-[calc(100vh-16rem)] lg:overflow-y-auto relative"
                    id="tasksContainer"
                  >
                    {error ? (
                      <div className="text-red-500">{error}</div>
                    ) : tasks.length > 0 ? (
                      tasks.map((task) => (
                        <TaskItem key={task.id} task={task} />
                      ))
                    ) : (
                      <div className="text-zinc-300">No tasks available</div>
                    )}
                    <div
                      id="scrollIndicator"
                      className="absolute bottom-2 left-1/2 transform -translate-x-1/2 transition-opacity duration-300 hidden lg:block"
                      style={{ opacity: 0 }}
                    >
                      <div className="animate-bounce">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-6 w-6 text-white opacity-50"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 14l-7 7m0 0l-7-7m7 7V3"
                          />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <div className="text-center py-2">
        <div className="text-white">Icham M'MADI</div>
        <RainbowText>
          <span className="text-sm">Creative Web Developer</span>
        </RainbowText>
      </div>
    </>
  );
};

export default Home;
