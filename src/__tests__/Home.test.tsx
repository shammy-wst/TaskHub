import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import { configureStore } from "@reduxjs/toolkit";
import Home from "../pages/Home";
import tasksReducer from "../features/taskSlice";

jest.mock("../hooks/useSound", () => ({
  useSound: () => ({
    playClickSound: jest.fn(),
  }),
}));

describe("Home Component", () => {
  const store = configureStore({
    reducer: {
      tasks: tasksReducer,
    },
  });

  const renderHome = () => {
    localStorage.setItem("authToken", "fake-token");
    return render(
      <Provider store={store}>
        <BrowserRouter>
          <Home />
        </BrowserRouter>
      </Provider>
    );
  };

  beforeEach(() => {
    store.dispatch({ type: "tasks/resetTasks" });
  });

  test("renders task list", () => {
    renderHome();
    fireEvent.keyDown(document, { key: " ", code: "Space" });
    expect(screen.getByText("My Tasks")).toBeTruthy();
  });

  test("shows no tasks message when empty", () => {
    renderHome();
    fireEvent.keyDown(document, { key: " ", code: "Space" });
    expect(screen.getByText("No tasks available")).toBeTruthy();
  });

  test("renders task creation form", () => {
    renderHome();
    fireEvent.keyDown(document, { key: " ", code: "Space" });
    expect(screen.getByPlaceholderText(/task title/i)).toBeTruthy();
  });
});
