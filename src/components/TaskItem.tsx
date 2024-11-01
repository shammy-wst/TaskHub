import React from "react";
import { useDispatch } from "react-redux";
import {
  updateTaskStatus,
  deleteTask,
  TaskStatus,
} from "../features/taskSlice";
import { AppDispatch } from "../app/store";

interface TaskProps {
  task: {
    id: number;
    title: string;
    description: string;
    status: TaskStatus;
    statusId?: number;
  };
}

const TaskItem: React.FC<TaskProps> = ({ task }) => {
  const dispatch = useDispatch<AppDispatch>();

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newStatus = e.target.value as TaskStatus;
    dispatch(updateTaskStatus({ id: task.id, status: newStatus }))
      .unwrap()
      .then(() => {
        console.log("Status updated successfully");
      })
      .catch((error) => {
        console.error("Error updating status:", error);
      });
  };

  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete this task?")) {
      dispatch(deleteTask(task.id))
        .unwrap()
        .then(() => {
          console.log("Task deleted successfully");
        })
        .catch((error) => {
          console.error("Error deleting task:", error);
        });
    }
  };

  return (
    <div className="bg-black border-[3px] border-white p-4 md:p-6 group">
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
              onChange={(e) =>
                handleStatusChange(e as React.ChangeEvent<HTMLSelectElement>)
              }
              className="bg-black text-white border-[3px] border-white p-2 appearance-none pr-8 relative"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='white' viewBox='0 0 24 24'%3E%3Cpath d='M7 10l5 5 5-5z'/%3E%3C/svg%3E")`,
                backgroundPosition: "right 0.5rem center",
                backgroundRepeat: "no-repeat",
                backgroundSize: "1.5em",
              }}
            >
              <option value="en_attente">Pending</option>
              <option value="en_cours">In Progress</option>
              <option value="terminé">Completed</option>
            </select>
          </div>
        </div>
        <button
          onClick={handleDelete}
          className="w-full sm:w-auto px-4 py-2 bg-black text-red-500 border-[3px] border-white hover:bg-red-500 hover:text-white transition-all duration-200"
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default TaskItem;
