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
    <div>
      <h3>{task.title}</h3>
      <p>{task.description}</p>
      <p>Status: {task.status}</p>
    </div>
  );
};

export default TaskItem;
