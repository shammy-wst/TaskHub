import { TaskStatus } from "../features/taskSlice";

export const getStatusFromId = (statusId: number): TaskStatus | null => {
  switch (statusId) {
    case 1:
      return "en_attente";
    case 2:
      return "en_cours";
    case 3:
      return "terminé";
    default:
      return null;
  }
};

export const getStatusColor = (status: TaskStatus): string => {
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

export const getStatusBg = (status: TaskStatus): string => {
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
