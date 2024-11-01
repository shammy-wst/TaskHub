import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export const TASK_STATUSES = ["en_cours", "terminé", "en_attente"] as const;
export type TaskStatus = (typeof TASK_STATUSES)[number];

interface Task {
  id: number;
  title: string;
  description: string;
  status: TaskStatus;
  statusId?: number;
}

interface CreateTaskPayload {
  title: string;
  description: string;
  status: TaskStatus;
}

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:3001";

export const fetchTasks = createAsyncThunk("tasks/fetchTasks", async () => {
  try {
    const token = localStorage.getItem("authToken");
    if (!token) {
      throw new Error("Non authentifié");
    }

    const response = await fetch(`${API_URL}/api/tasks`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Erreur HTTP: ${response.status}`);
    }

    const data = await response.json();
    // Convertir statusId en status
    return data.map((task: any) => ({
      ...task,
      status: getStatusFromId(task.statusId) || "en_attente",
    }));
  } catch (error) {
    console.error("Erreur dans fetchTasks:", error);
    throw error;
  }
});

export const createTask = createAsyncThunk(
  "tasks/createTask",
  async (task: CreateTaskPayload) => {
    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        throw new Error("Non authentifié");
      }

      const response = await fetch(`${API_URL}/api/tasks`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(task),
      });

      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }

      const data = await response.json();
      return {
        ...data,
        status: getStatusFromId(data.statusId) || "en_attente",
      };
    } catch (error) {
      console.error("Erreur dans createTask:", error);
      throw error;
    }
  }
);

export const updateTaskStatus = createAsyncThunk(
  "tasks/updateTaskStatus",
  async ({ id, status }: { id: number; status: TaskStatus }) => {
    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        throw new Error("Non authentifié");
      }

      const response = await fetch(`${API_URL}/api/tasks/${id}`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status,
        }),
      });

      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }

      const data = await response.json();
      return {
        ...data,
        status: status, // Utiliser le status envoyé plutôt que celui de la réponse
      };
    } catch (error) {
      console.error("Erreur dans updateTaskStatus:", error);
      throw error;
    }
  }
);

export const deleteTask = createAsyncThunk(
  "tasks/deleteTask",
  async (id: number) => {
    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        throw new Error("Non authentifié");
      }

      const response = await fetch(`${API_URL}/api/tasks/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }

      return id;
    } catch (error) {
      console.error("Erreur dans deleteTask:", error);
      throw error;
    }
  }
);

// Fonction utilitaire pour convertir statusId en status
function getStatusFromId(statusId: number | null): TaskStatus | null {
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
}

const taskSlice = createSlice({
  name: "tasks",
  initialState: {
    items: [] as Task[],
    status: "idle",
    error: null as string | null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTasks.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchTasks.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = action.payload;
      })
      .addCase(fetchTasks.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message || "Une erreur est survenue";
      })
      .addCase(createTask.pending, (state) => {
        state.status = "loading";
      })
      .addCase(createTask.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items.push(action.payload);
      })
      .addCase(createTask.rejected, (state, action) => {
        state.status = "failed";
        state.error =
          action.error.message || "Erreur lors de la création de la tâche";
      })
      .addCase(updateTaskStatus.pending, (state) => {
        state.status = "loading";
      })
      .addCase(updateTaskStatus.fulfilled, (state, action) => {
        state.status = "succeeded";
        const index = state.items.findIndex(
          (task) => task.id === action.payload.id
        );
        if (index !== -1) {
          state.items[index] = action.payload;
        }
      })
      .addCase(updateTaskStatus.rejected, (state, action) => {
        state.status = "failed";
        state.error =
          action.error.message || "Erreur lors de la mise à jour du statut";
      })
      .addCase(deleteTask.pending, (state) => {
        state.status = "loading";
      })
      .addCase(deleteTask.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = state.items.filter((task) => task.id !== action.payload);
      })
      .addCase(deleteTask.rejected, (state, action) => {
        state.status = "failed";
        state.error =
          action.error.message || "Erreur lors de la suppression de la tâche";
      });
  },
});

export default taskSlice.reducer;
