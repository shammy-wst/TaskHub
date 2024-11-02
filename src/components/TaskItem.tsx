import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../app/store";
import { updateTaskStatus, deleteTask, Task } from "../features/taskSlice";
import { useSound } from "../hooks/useSound";

interface TaskProps {
  task: Task;
}

const TaskItem: React.FC<TaskProps> = React.memo(({ task }) => {
  const dispatch = useDispatch<AppDispatch>();
  const { playClickSound } = useSound();
  const [isHoveringDelete, setIsHoveringDelete] = useState(false);

  const getStatusColor = (status: Task["status"]) => {
    switch (status) {
      case "en_attente":
        return "border-yellow-500";
      case "en_cours":
        return "border-blue-500";
      case "terminé":
        return "border-green-500";
      default:
        return "border-white";
    }
  };

  const getStatusBg = (status: Task["status"]) => {
    switch (status) {
      case "en_attente":
        return "bg-yellow-500/10";
      case "en_cours":
        return "bg-blue-500/10";
      case "terminé":
        return "bg-green-500/10";
      default:
        return "bg-black";
    }
  };

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    playClickSound();
    const newStatus = e.target.value as Task["status"];
    dispatch(updateTaskStatus({ id: task.id, status: newStatus }))
      .unwrap()
      .catch((error) => {
        console.error("Erreur silencieuse:", error);
      });
  };

  return (
    <div
      className={`relative flex flex-col border-[3px] rounded-lg p-4 md:p-6 group mb-4 
                     ${getStatusColor(task.status)} ${getStatusBg(
        task.status
      )}`}
    >
      <div className="absolute -left-[3px] top-4 bottom-4 w-1.5 rounded-r-full bg-current" />

      <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
        <div className="flex-1 w-full sm:w-auto">
          <h3 className="text-lg md:text-xl font-semibold text-white">
            {task.title}
          </h3>
          <p className="text-zinc-300 mt-2 text-sm md:text-base">
            {task.description}
          </p>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4 mt-4">
            <span className="text-zinc-300">Status:</span>
            <select
              value={task.status}
              onChange={handleStatusChange}
              className={`text-white border-[3px] rounded-lg p-2 appearance-none pr-8 relative
                         ${getStatusColor(task.status)} ${getStatusBg(
                task.status
              )}`}
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='white' viewBox='0 0 24 24'%3E%3Cpath d='M7 10l5 5 5-5z'/%3E%3C/svg%3E")`,
                backgroundPosition: "right 0.5rem center",
                backgroundRepeat: "no-repeat",
                backgroundSize: "1.5em",
              }}
            >
              <option value="pending">Pending</option>
              <option value="in_progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>
          </div>
        </div>
        <button
          onMouseEnter={() => setIsHoveringDelete(true)}
          onMouseLeave={() => setIsHoveringDelete(false)}
          onClick={() => {
            playClickSound();
            if (window.confirm("Are you sure you want to delete this task?")) {
              dispatch(deleteTask(task.id));
            }
          }}
          className="relative group/delete border-2 border-red-500/30 bg-red-500/10 
                     hover:bg-red-500 hover:border-red-500 text-red-500 hover:text-white 
                     rounded-lg px-4 py-2 transition-all duration-300 overflow-hidden"
        >
          <span
            className={`flex items-center gap-2 transition-transform duration-300 ${
              isHoveringDelete ? "translate-x-12 opacity-0" : ""
            }`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
            Delete
          </span>
          <span
            className={`absolute inset-0 flex items-center justify-center transition-transform duration-300 ${
              isHoveringDelete ? "translate-x-0" : "-translate-x-12 opacity-0"
            }`}
          >
            Confirm?
          </span>
        </button>
      </div>
    </div>
  );
});

export default TaskItem;
