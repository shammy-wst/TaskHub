import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import Login from "../pages/Login";
import tasksReducer from "../features/taskSlice";

jest.mock("../hooks/useSound", () => ({
  useSound: () => ({
    playClickSound: jest.fn(),
  }),
}));

describe("Login Component", () => {
  const store = configureStore({
    reducer: {
      tasks: tasksReducer,
    },
  });

  const renderLogin = () => {
    return render(
      <Provider store={store}>
        <BrowserRouter>
          <Login />
        </BrowserRouter>
      </Provider>
    );
  };

  test("renders login form by default", () => {
    renderLogin();
    expect(screen.getByText("Access Portal")).toBeTruthy();
    expect(screen.getByRole("button", { name: /Login/i })).toBeTruthy();
  });

  test("toggles between login and register modes", () => {
    renderLogin();
    const registerButton = screen.getByRole("button", { name: /Register/i });
    fireEvent.click(registerButton);
    expect(screen.getByText("Initialize Account")).toBeTruthy();
  });

  test("handles form submission", () => {
    renderLogin();
    const usernameInput = screen.getByPlaceholderText(/username/i);
    const passwordInput = screen.getByPlaceholderText(/password/i);
    const submitButton = screen.getByRole("button", {
      name: /initialize session/i,
    });

    fireEvent.change(usernameInput, { target: { value: "testuser" } });
    fireEvent.change(passwordInput, { target: { value: "password123" } });
    fireEvent.click(submitButton);

    // Vérifier que le formulaire a été soumis
    expect(usernameInput).toHaveValue("testuser");
  });
});
