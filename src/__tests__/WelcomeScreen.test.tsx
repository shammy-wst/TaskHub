import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import WelcomeScreen from "../components/WelcomeScreen";

describe("WelcomeScreen Component", () => {
  const mockOnComplete = jest.fn();

  beforeAll(() => {
    window.HTMLMediaElement.prototype.play = jest
      .fn()
      .mockImplementation(() => Promise.resolve());
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renders welcome message", () => {
    render(<WelcomeScreen onComplete={mockOnComplete} />);
    expect(screen.getByText(/Enable Sound/i)).toBeTruthy();
  });

  test("handles sound enable button click", () => {
    render(<WelcomeScreen onComplete={mockOnComplete} />);
    const enableButton = screen.getByRole("button", { name: /Enable Sound/i });
    fireEvent.click(enableButton);
    // Vérifier que l'audio a été initialisé
  });

  test("handles space key press", () => {
    render(<WelcomeScreen onComplete={mockOnComplete} />);
    fireEvent.keyDown(window, { code: "Space" });
    expect(mockOnComplete).toHaveBeenCalled();
  });
});
