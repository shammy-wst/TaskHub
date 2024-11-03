import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export const API_URL =
  process.env.REACT_APP_API_URL || "https://taskhub-backend-di2m.onrender.com";

export type TaskStatus = "en_attente" | "en_cours" | "terminé";

export interface Task {
  id: number;
  title: string;
  description: string;
  status: TaskStatus;
}

interface TaskResponse {
  id: number;
  title: string;
  description: string;
  status: TaskStatus;
}

export interface TaskState {
  items: Task[];
  status: "idle" | "loading" | "succeeded" | "failed";
  error: TaskError | null;
}

export interface TaskError {
  message: string;
  code?: number;
}

const initialState: TaskState = {
  items: [],
  status: "idle",
  error: null,
};

export const fetchTasks = createAsyncThunk(
  "tasks/fetchTasks",
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        return rejectWithValue("Non authentifié");
      }

      const response = await fetch(`${API_URL}/api/tasks`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        return rejectWithValue(`Erreur HTTP: ${response.status}`);
      }

      const data = await response.json();

      return data.map((task: TaskResponse) => ({
        id: task.id,
        title: task.title,
        description: task.description,
        status: task.status,
      }));
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : "Erreur inconnue"
      );
    }
  }
);

export const updateTaskStatus = createAsyncThunk(
  "tasks/updateTaskStatus",
  async (
    { id, status }: { id: number; status: TaskStatus },
    { rejectWithValue }
  ) => {
    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        return rejectWithValue("Non authentifié");
      }

      const response = await fetch(`${API_URL}/api/tasks/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status }),
      });

      if (!response.ok) {
        return rejectWithValue(`Erreur HTTP: ${response.status}`);
      }

      return { id, status };
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : "Erreur inconnue"
      );
    }
  }
);

export const deleteTask = createAsyncThunk(
  "tasks/deleteTask",
  async (id: number, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        return rejectWithValue("Non authentifié");
      }

      const response = await fetch(`${API_URL}/api/tasks/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        return rejectWithValue(`Erreur HTTP: ${response.status}`);
      }

      return id;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : "Erreur inconnue"
      );
    }
  }
);

export const createTask = createAsyncThunk(
  "tasks/createTask",
  async (
    {
      title,
      description,
      status,
    }: {
      title: string;
      description: string;
      status: TaskStatus;
    },
    { rejectWithValue }
  ) => {
    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        return rejectWithValue("Non authentifié");
      }

      const response = await fetch(`${API_URL}/api/tasks`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ title, description, status }),
      });

      if (!response.ok) {
        return rejectWithValue(`Erreur HTTP: ${response.status}`);
      }

      const data = await response.json();

      return data;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : "Erreur inconnue"
      );
    }
  }
);

const tasksSlice = createSlice({
  name: "tasks",
  initialState,
  reducers: {
    resetTasks: (state) => {
      state.items = [];
      state.status = "idle";
      state.error = null;
    },
  },
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
        state.error = {
          message: (action.payload as string) || "Une erreur est survenue",
        };
      })
      .addCase(updateTaskStatus.fulfilled, (state, action) => {
        const task = state.items.find((t) => t.id === action.payload.id);
        if (task) {
          task.status = action.payload.status;
        }
      })
      .addCase(deleteTask.fulfilled, (state, action) => {
        state.items = state.items.filter((task) => task.id !== action.payload);
      })
      .addCase(createTask.fulfilled, (state, action) => {
        state.items.push(action.payload);
      });
  },
});

export default tasksSlice.reducer;

export const { resetTasks } = tasksSlice.actions;
