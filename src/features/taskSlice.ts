import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// Définir les statuts valides comme type
type TaskStatus = "incomplete" | "complete" | "in_progress";

interface Task {
  id: number;
  title: string;
  description: string;
  status: TaskStatus;
}

interface CreateTaskPayload {
  title: string;
  description: string;
  status: TaskStatus;
}

// Thunk pour récupérer les tâches
export const fetchTasks = createAsyncThunk("tasks/fetchTasks", async () => {
  try {
    console.log("Début fetchTasks");
    const token = localStorage.getItem("authToken");
    console.log("Token récupéré:", token ? "Présent" : "Absent");

    if (!token) {
      throw new Error("Non authentifié");
    }

    console.log("Envoi requête GET /api/tasks");
    const response = await fetch("http://localhost:3001/api/tasks", {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    console.log("Réponse reçue:", response.status);
    if (!response.ok) {
      throw new Error(`Erreur HTTP: ${response.status}`);
    }

    const data = await response.json();
    console.log("Données reçues:", data);
    return data;
  } catch (error) {
    console.error("Erreur dans fetchTasks:", error);
    throw error;
  }
});

// Thunk pour créer une tâche
export const createTask = createAsyncThunk(
  "tasks/createTask",
  async (task: CreateTaskPayload) => {
    try {
      console.log("Début createTask avec données:", task);
      const token = localStorage.getItem("authToken");
      console.log("Token récupéré:", token ? "Présent" : "Absent");

      if (!token) {
        throw new Error("Non authentifié");
      }

      console.log("Envoi requête POST /api/tasks");
      const response = await fetch("http://localhost:3001/api/tasks", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(task),
      });

      console.log("Réponse reçue:", response.status);
      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }

      const data = await response.json();
      console.log("Tâche créée:", data);
      return data;
    } catch (error) {
      console.error("Erreur dans createTask:", error);
      throw error;
    }
  }
);

// Thunk pour mettre à jour le statut d'une tâche
export const updateTaskStatus = createAsyncThunk(
  "tasks/updateTaskStatus",
  async ({ id, status }: { id: number; status: TaskStatus }) => {
    try {
      console.log("Début updateTaskStatus avec données:", { id, status });
      const token = localStorage.getItem("authToken");
      console.log("Token récupéré:", token ? "Présent" : "Absent");

      if (!token) {
        throw new Error("Non authentifié");
      }

      console.log(`Envoi requête PATCH /api/tasks/${id}`);
      const response = await fetch(`http://localhost:3001/api/tasks/${id}`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status }),
      });

      console.log("Réponse reçue:", response.status);
      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }

      const data = await response.json();
      console.log("Statut de la tâche mis à jour:", data);
      return data;
    } catch (error) {
      console.error("Erreur dans updateTaskStatus:", error);
      throw error;
    }
  }
);

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
        console.log("fetchTasks: pending");
        state.status = "loading";
      })
      .addCase(fetchTasks.fulfilled, (state, action) => {
        console.log("fetchTasks: fulfilled", action.payload);
        state.status = "succeeded";
        state.items = action.payload;
      })
      .addCase(fetchTasks.rejected, (state, action) => {
        console.log("fetchTasks: rejected", action.error);
        state.status = "failed";
        state.error = action.error.message || "Une erreur est survenue";
      })
      .addCase(createTask.pending, (state) => {
        console.log("createTask: pending");
        state.status = "loading";
      })
      .addCase(createTask.fulfilled, (state, action) => {
        console.log("createTask: fulfilled", action.payload);
        state.status = "succeeded";
        state.items.push(action.payload);
      })
      .addCase(createTask.rejected, (state, action) => {
        console.log("createTask: rejected", action.error);
        state.status = "failed";
        state.error =
          action.error.message || "Erreur lors de la création de la tâche";
      })
      .addCase(updateTaskStatus.pending, (state) => {
        console.log("updateTaskStatus: pending");
        state.status = "loading";
      })
      .addCase(updateTaskStatus.fulfilled, (state, action) => {
        console.log("updateTaskStatus: fulfilled", action.payload);
        state.status = "succeeded";
        const index = state.items.findIndex(
          (task) => task.id === action.payload.id
        );
        if (index !== -1) {
          state.items[index] = action.payload;
        }
      })
      .addCase(updateTaskStatus.rejected, (state, action) => {
        console.log("updateTaskStatus: rejected", action.error);
        state.status = "failed";
        state.error =
          action.error.message || "Erreur lors de la mise à jour du statut";
      });
  },
});

export default taskSlice.reducer;
