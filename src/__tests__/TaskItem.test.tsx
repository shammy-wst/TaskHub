import React from "react";
import { render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import tasksReducer, { TaskState } from "../features/taskSlice";
import TaskItem from "../components/TaskItem";
import type { Task, TaskStatus } from "../features/taskSlice";
import userEvent from "@testing-library/user-event";

interface RootState {
  tasks: TaskState;
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
    status: "en_attente" as TaskStatus,
  };

  let store: ReturnType<typeof configureStore>;

  beforeEach(() => {
    const initialState: TaskState = {
      items: [mockTask],
      status: "idle",
      error: null,
    };

    store = configureStore({
      reducer: {
        tasks: tasksReducer,
      },
      preloadedState: {
        tasks: initialState,
      },
    });

    global.fetch = jest.fn().mockImplementation(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ ...mockTask, status: "en_cours" }),
      })
    ) as jest.Mock;

    Storage.prototype.getItem = jest.fn(() => "fake-token");
  });

  test("allows status change", async () => {
    const user = userEvent.setup();

    const { rerender } = render(
      <Provider store={store}>
        <TaskItem task={mockTask} />
      </Provider>
    );

    const statusSelect = screen.getByRole("combobox", { name: /status/i });
    await user.selectOptions(statusSelect, "en_cours");

    // Attendre que le state soit mis à jour
    await new Promise((resolve) => setTimeout(resolve, 0));

    // Vérifier que le state a été mis à jour
    const state = store.getState() as RootState;
    expect(state.tasks.items[0].status).toBe("en_cours");

    // Re-render avec la tâche mise à jour
    rerender(
      <Provider store={store}>
        <TaskItem task={{ ...mockTask, status: "en_cours" }} />
      </Provider>
    );

    // Maintenant le select devrait avoir la nouvelle valeur
    const updatedSelect = screen.getByRole("combobox", { name: /status/i });
    expect(updatedSelect).toHaveValue("en_cours");
  });
});
