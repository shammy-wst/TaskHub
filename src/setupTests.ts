import "@testing-library/jest-dom";
import { configure } from "@testing-library/react";

configure({
  asyncUtilTimeout: 2000,
});

// Mock HTMLMediaElement
window.HTMLMediaElement.prototype.play = jest.fn(() => Promise.resolve());
window.HTMLMediaElement.prototype.pause = jest.fn();

// Supprimer TOUS les avertissements qu'on veut ignorer
const originalError = console.error;
beforeAll(() => {
  console.error = (...args) => {
    if (
      /Warning.*not wrapped in act/.test(args[0]) ||
      /Warning.*ReactDOM.render is no longer supported/.test(args[0]) ||
      /Warning.*ReactDOMTestUtils.act/.test(args[0]) ||
      /Error: Not implemented:.*/.test(args[0])
    ) {
      return;
    }
    originalError.call(console, ...args);
  };
});

afterAll(() => {
  console.error = originalError;
});
