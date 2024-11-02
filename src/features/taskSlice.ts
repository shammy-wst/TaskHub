import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export const API_URL = process.env.REACT_APP_API_URL || "http://localhost:3001";

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
  statusId: number;
}

interface SerializedError {
  name?: string;
  message?: string;
  code?: string | number;
  stack?: string;
}

export interface TaskError {
  message: string;
  code?: number;
}

function serializeError(error: SerializedError): TaskError {
  return {
    message: error.message || "Une erreur est survenue",
    code:
      typeof error.code === "string" ? parseInt(error.code, 10) : error.code,
  };
}

export interface TaskState {
  items: Task[];
  status: "idle" | "loading" | "succeeded" | "failed";
  error: TaskError | null;
}

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
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        return rejectWithValue(`Erreur HTTP: ${response.status}`);
      }

      const data = await response.json();
      return data.map((task: TaskResponse) => ({
        ...task,
        status: getStatusFromId(task.statusId) || "en_attente",
      }));
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : "Erreur inconnue"
      );
    }
  }
);

export const createTask = createAsyncThunk(
  "tasks/createTask",
  async (task: Omit<Task, "id">) => {
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
      return data;
    } catch (error) {
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
        body: JSON.stringify({ status }),
      });

      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }

      return { id, status };
    } catch (error) {
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
      throw error;
    }
  }
);

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

const initialState: TaskState = {
  items: [],
  status: "idle",
  error: null,
};

const taskSlice = createSlice({
  name: "tasks",
  initialState,
  reducers: {
    resetTasks: (state) => {
      state.items = [];
      state.status = "idle";
      state.error = null;
    },
    setTasks: (state, action) => {
      state.items = action.payload;
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
        state.error = serializeError(action.error);
      })
      .addCase(createTask.fulfilled, (state, action) => {
        state.items.push(action.payload);
      })
      .addCase(updateTaskStatus.fulfilled, (state, action) => {
        const task = state.items.find((t) => t.id === action.payload.id);
        if (task) {
          task.status = action.payload.status;
        }
      })
      .addCase(deleteTask.fulfilled, (state, action) => {
        state.items = state.items.filter((task) => task.id !== action.payload);
      });
  },
});

export const { resetTasks, setTasks } = taskSlice.actions;
export default taskSlice.reducer;
