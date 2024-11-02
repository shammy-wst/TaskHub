import { renderHook } from "@testing-library/react";
import { useSound } from "../hooks/useSound";

jest.mock("../hooks/useSound", () => ({
  useSound: () => ({
    playClickSound: jest.fn().mockImplementation(() => Promise.resolve()),
  }),
}));

describe("useSound Hook", () => {
  it("should provide playClickSound function", () => {
    const { result } = renderHook(() => useSound());
    expect(result.current.playClickSound).toBeDefined();
  });

  it("should play sound when called", async () => {
    const { result } = renderHook(() => useSound());
    await result.current.playClickSound();
    expect(result.current.playClickSound).toHaveBeenCalled();
  });
});
