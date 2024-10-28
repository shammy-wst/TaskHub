import { configureStore } from "@reduxjs/toolkit";
import tasksReducer from "../features/taskSlice";

const store = configureStore({
  reducer: {
    tasks: tasksReducer,
  },
});

// Types RootState et AppDispatch pour utiliser dans les sélecteurs et les dispatchers
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
