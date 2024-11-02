import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import { configureStore } from "@reduxjs/toolkit";
import tasksReducer, { TaskStatus } from "../features/taskSlice";
import Home from "../pages/Home";

// Définir RootState localement
interface RootState {
  tasks: {
    items: any[];
    status: string;
    error: null | any;
  };
}

jest.mock("../hooks/useSound", () => ({
  useSound: () => ({
    playClickSound: jest.fn(),
  }),
}));

describe("Task Management Integration", () => {
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

  const renderApp = () => {
    return render(
      <Provider store={store}>
        <BrowserRouter>
          <Home />
        </BrowserRouter>
      </Provider>
    );
  };

  it("should handle complete task flow", async () => {
    // Mock API
    global.fetch = jest
      .fn()
      .mockImplementationOnce(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ tasks: [] }),
        })
      )
      .mockImplementationOnce(() =>
        Promise.resolve({
          ok: true,
          json: () =>
            Promise.resolve({
              task: {
                id: 1,
                title: "Integration Test Task",
                description: "Test Description",
                status: "pending" as TaskStatus,
              },
            }),
        })
      );

    renderApp();

    // Fermer le WelcomeScreen
    const enableSoundButton = screen.getByText(/Enable Sound/i);
    fireEvent.click(enableSoundButton);
    fireEvent.keyDown(document, { key: " ", code: "Space" });

    // Remplir et soumettre
    await waitFor(() => {
      expect(screen.getByPlaceholderText(/Task title/i)).toBeInTheDocument();
    });

    fireEvent.change(screen.getByPlaceholderText(/Task title/i), {
      target: { value: "Integration Test Task" },
    });

    fireEvent.change(screen.getByPlaceholderText(/Description/i), {
      target: { value: "Test Description" },
    });

    const addButton = screen.getByRole("button", { name: /Add Task/i });
    fireEvent.click(addButton);

    // Vérifier l'état final
    await waitFor(() => {
      const state = store.getState() as RootState;
      expect(state.tasks.items).toHaveLength(1);
    });
  });
});
