import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// Définir les statuts valides comme type
type TaskStatus = "en_cours" | "terminé" | "en_attente";

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

export const createTask = createAsyncThunk(
  "tasks/createTask",
  async (taskData: CreateTaskPayload) => {
    try {
      console.log("Début createTask avec données:", taskData);
      const token = localStorage.getItem("authToken");
      console.log("Token récupéré:", token ? "Présent" : "Absent");

      if (!token) {
        throw new Error("Non authentifié");
      }

      // Vérifier que le status est valide
      if (!["en_cours", "terminé", "en_attente"].includes(taskData.status)) {
        throw new Error("Status invalide");
      }

      console.log("Envoi requête POST /api/tasks");
      const response = await fetch("http://localhost:3001/api/tasks", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...taskData,
          status: taskData.status,
        }),
      });

      console.log("Réponse reçue:", response.status);
      if (!response.ok) {
        const errorData = await response.json();
        console.error("Erreur détaillée:", errorData);
        throw new Error(
          errorData.message || "Erreur lors de la création de la tâche"
        );
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

const taskSlice = createSlice({
  name: "tasks",
  initialState: {
    items: [] as Task[],
    status: "idle",
    error: null as string | null,
  },
  reducers: {
    updateTaskStatus: (state, action) => {
      console.log("updateTaskStatus appelé avec:", action.payload);
      const { id, status } = action.payload;
      const task = state.items.find((task) => task.id === id);
      if (task) {
        task.status = status;
        console.log("Status mis à jour pour la tâche:", id);
      } else {
        console.log("Tâche non trouvée:", id);
      }
    },
  },
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
      });
  },
});

export const { updateTaskStatus } = taskSlice.actions;
export default taskSlice.reducer;
