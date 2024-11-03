import { store } from "../app/store";
import { resetTasks } from "../features/taskSlice";

describe("Redux Store", () => {
  it("should have the correct initial state", () => {
    const state = store.getState();
    expect(state.tasks).toBeDefined();
    expect(state.tasks.items).toEqual([]);
    expect(state.tasks.status).toBe("idle");
  });

  it("should handle dispatched actions", () => {
    store.dispatch(resetTasks());
    const state = store.getState();
    expect(state.tasks.items).toEqual([]);
  });
});
