import React from "react";
import { useDispatch } from "react-redux";
import { updateTaskStatus, type TaskStatus } from "../features/taskSlice";
import { AppDispatch } from "../app/store";

interface TaskProps {
  task: {
    id: number;
    title: string;
    description: string;
    status: TaskStatus;
  };
}

const TaskItem: React.FC<TaskProps> = ({ task }) => {
  const dispatch = useDispatch<AppDispatch>();

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newStatus = e.target.value as TaskStatus;
    dispatch(updateTaskStatus({ id: task.id, status: newStatus }));
  };

  return (
    <div className="p-4 mb-4 bg-white rounded-lg shadow-md border-l-4 border-blue-500">
      <h3 className="text-xl font-semibold">{task.title}</h3>
      <p className="text-gray-600">{task.description}</p>
      <p className="text-sm font-medium mt-2">
        Status:{" "}
        <select
          value={task.status}
          onChange={handleStatusChange}
          className="ml-2 p-1 border rounded"
        >
          <option value="en_cours">En cours</option>
          <option value="terminé">Terminé</option>
          <option value="en_attente">En attente</option>
        </select>
      </p>
    </div>
  );
};

export default TaskItem;
