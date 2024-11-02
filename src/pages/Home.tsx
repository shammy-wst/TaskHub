import React, { useState, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchTasks, createTask } from "../features/taskSlice";
import TaskItem from "../components/TaskItem";
import { RootState, AppDispatch } from "../app/store";
import { useNavigate } from "react-router-dom";
import WelcomeScreen from "../components/WelcomeScreen";
import fujiGif from "../assets/fuji.gif";
import galaxyGif from "../assets/galaxy.gif";
import { useSound } from "../hooks/useSound";
import Header from "../components/Header";
import Footer from "../components/Footer";
import cubeGif from "../assets/cube.gif";
import { useLastVisit } from "../hooks/useLastVisit";

const Home: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const tasks = useSelector((state: RootState) => state.tasks.items);
  const taskStatus = useSelector((state: RootState) => state.tasks.status);
  const error = useSelector((state: RootState) => state.tasks.error);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [formError, setFormError] = useState<string | null>(null);
  const { playClickSound } = useSound();
  const { showWelcome, updateLastVisit } = useLastVisit();

  useEffect(() => {
    const token = localStorage.getItem("authToken");

    if (!token) {
      navigate("/login");
      return;
    }

    if (taskStatus === "idle") {
      dispatch(fetchTasks())
        .unwrap()
        .catch((error) => {
          if (error.message.includes("Non authentifié")) {
            navigate("/login");
          }
        });
    }
  }, [taskStatus, dispatch, navigate]);

  const handleAddTask = useCallback(
    async (e: React.FormEvent) => {
      playClickSound();
      e.preventDefault();
      setFormError(null);

      if (!title.trim() || !description.trim()) {
        setFormError("Title and description are required");
        return;
      }

      try {
        await dispatch(
          createTask({
            title: title.trim(),
            description: description.trim(),
            status: "en_attente",
          })
        ).unwrap();

        setTitle("");
        setDescription("");
        dispatch(fetchTasks());
      } catch (error) {
        setFormError(
          error instanceof Error
            ? error.message
            : "Une erreur inattendue s'est produite"
        );
      }
    },
    [dispatch, title, description, playClickSound]
  );

  return (
    <div className="min-h-screen flex flex-col bg-black">
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

      <main className="flex-1 flex items-center justify-center w-full p-6 relative z-10">
        <div className="w-full max-w-7xl">
          {showWelcome ? (
            <WelcomeScreen onComplete={updateLastVisit} />
          ) : (
            <div className="flex flex-col lg:flex-row gap-6">
              {/* Colonne gauche (1/3) - Form et About */}
              <div className="lg:w-1/3 flex-shrink-0 flex flex-col gap-6">
                {/* Task Form */}
                <div className="border-[3px] border-white rounded-lg p-6 flex flex-col gap-4">
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
                  <form
                    className="flex flex-col gap-4"
                    onSubmit={handleAddTask}
                  >
                    <input
                      type="text"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="Task title"
                      className="w-full border-[3px] border-white rounded-lg p-3 focus:outline-none focus:border-blue-500 transition-colors placeholder-zinc-500 bg-black text-white"
                    />
                    <textarea
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Description"
                      className="w-full border-[3px] border-white rounded-lg p-3 focus:outline-none focus:border-blue-500 transition-colors placeholder-zinc-500 bg-black text-white min-h-[120px] resize-none"
                    />
                    {formError && (
                      <div className="text-red-500 text-sm">{formError}</div>
                    )}
                    <button
                      type="submit"
                      className="relative w-full border-[3px] border-white rounded-lg p-3 text-white group"
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
                <div className="border-[3px] border-white rounded-lg p-6">
                  <div className="flex flex-col gap-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-bold text-white font-mono">
                        About TaskHub
                      </h3>
                      <button
                        onClick={() => {
                          playClickSound();
                          navigate("/about");
                        }}
                        className="relative border-[3px] border-white rounded-lg px-4 py-2 text-white transition-all duration-200 font-mono text-sm flex items-center gap-2 group"
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

              {/* Colonne droite (2/3) - Tasks */}
              <div className="flex-1">
                <div className="border-[3px] border-white rounded-lg p-6 h-fit">
                  <div className="flex flex-col gap-4">
                    <h2 className="text-xl font-bold text-white">My Tasks</h2>
                    <div
                      className="lg:max-h-[calc(100vh-16rem)] lg:overflow-y-auto relative"
                      id="tasksContainer"
                    >
                      {error ? (
                        <div className="text-red-500">{error.message}</div>
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
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Home;
