import { configureStore } from "@reduxjs/toolkit";
import tasksReducer from "../features/taskSlice";

// Configuration du store Redux avec le reducer des tâches
const store = configureStore({
  reducer: {
    tasks: tasksReducer,
  },
});

// Type pour accéder au state global de l'application
export type RootState = ReturnType<typeof store.getState>;

// Type pour le dispatch des actions avec TypeScript
export type AppDispatch = typeof store.dispatch;

export default store;
