import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import Header from "../components/Header";
import tasksReducer from "../features/taskSlice";

jest.mock("../hooks/useSound", () => ({
  useSound: () => ({
    playClickSound: jest.fn(),
  }),
}));

describe("Header Component", () => {
  const store = configureStore({
    reducer: {
      tasks: tasksReducer,
    },
  });

  const renderHeader = () => {
    return render(
      <Provider store={store}>
        <BrowserRouter>
          <Header />
        </BrowserRouter>
      </Provider>
    );
  };

  test("shows logout button when user is authenticated", () => {
    localStorage.setItem("authToken", "fake-token");
    renderHeader();
    const logoutButton = screen.getByRole("button", {
      name: /TaskHub/i,
    });
    expect(logoutButton).toBeTruthy();
  });

  test("handles logout correctly", () => {
    renderHeader();
    const logoutButton = screen.getByRole("button", {
      name: "",
    });
    fireEvent.click(logoutButton);
    expect(localStorage.getItem("authToken")).toBeNull();
  });
});
