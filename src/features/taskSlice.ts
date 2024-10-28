import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";

interface Task {
  id: number;
  title: string;
  description: string;
  status: string;
}

interface TasksState {
  items: Task[];
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialState: TasksState = {
  items: [],
  status: "idle",
  error: null,
};

export const fetchTasks = createAsyncThunk("tasks/fetchTasks", async () => {
  const response = await axios.get("/api/tasks");
  return response.data;
});

const tasksSlice = createSlice({
  name: "tasks",
  initialState,
  reducers: {
    addTask: (state, action: PayloadAction<Task>) => {
      state.items.push(action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTasks.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchTasks.fulfilled, (state, action: PayloadAction<Task[]>) => {
        state.status = "succeeded";
        state.items = action.payload;
      })
      .addCase(fetchTasks.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message || "Erreur inconnue";
      });
  },
});

export const { addTask } = tasksSlice.actions;
export default tasksSlice.reducer;
