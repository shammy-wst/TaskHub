import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import TaskItem from "../components/TaskItem";
import tasksReducer, {
  setTasks,
  Task,
  TaskStatus,
} from "../features/taskSlice";

// Définir RootState localement
interface RootState {
  tasks: {
    items: Task[];
    status: string;
    error: null | any;
  };
}

jest.mock("../hooks/useSound", () => ({
  useSound: () => ({
    playClickSound: jest.fn(),
  }),
}));

describe("TaskItem Component", () => {
  const mockTask: Task = {
    id: 1,
    title: "Test Task",
    description: "Test Description",
    status: "pending" as TaskStatus,
  };

  let store: ReturnType<typeof configureStore>;

  beforeEach(() => {
    store = configureStore({
      reducer: {
        tasks: tasksReducer,
      },
    });
    localStorage.clear();
    localStorage.setItem("authToken", "fake-token");
  });

  test("renders task title and description", () => {
    render(
      <Provider store={store}>
        <TaskItem task={mockTask} />
      </Provider>
    );
    expect(screen.getByText(mockTask.title)).toBeTruthy();
    expect(screen.getByText(mockTask.description)).toBeTruthy();
  });

  test("renders with correct status style", () => {
    render(
      <Provider store={store}>
        <TaskItem task={mockTask} />
      </Provider>
    );
    const taskContainer = screen.getByRole("article", {
      name: new RegExp(mockTask.title),
    });
    expect(taskContainer).toHaveClass("border-white");
  });

  test("allows status change", async () => {
    // Initialiser avec la tâche
    store.dispatch(setTasks([mockTask]));

    // Mock API
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () =>
          Promise.resolve({
            task: { ...mockTask, status: "in_progress" as TaskStatus },
          }),
      })
    ) as jest.Mock;

    render(
      <Provider store={store}>
        <TaskItem task={mockTask} />
      </Provider>
    );

    const statusSelect = screen.getByRole("combobox", { name: /Status/i });
    fireEvent.change(statusSelect, { target: { value: "in_progress" } });

    await waitFor(() => {
      const state = store.getState() as RootState;
      expect(state.tasks.items[0].status).toBe("in_progress");
    });
  });
});
