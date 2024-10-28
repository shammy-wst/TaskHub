import React from "react";

interface TaskProps {
  task: {
    id: number;
    title: string;
    description: string;
    status: string;
  };
}

const TaskItem: React.FC<TaskProps> = ({ task }) => {
  return (
    <div className="p-4 mb-4 bg-white rounded-lg shadow-md border-l-4 border-blue-500">
      <h3 className="text-xl font-semibold">{task.title}</h3>
      <p className="text-gray-600">{task.description}</p>
      <p className="text-sm font-medium mt-2">
        Status:{" "}
        <span
          className={
            task.status === "completed" ? "text-green-500" : "text-yellow-500"
          }
        >
          {task.status}
        </span>
      </p>
    </div>
  );
};

export default TaskItem;
