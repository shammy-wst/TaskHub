import { configureStore } from "@reduxjs/toolkit";
import tasksReducer, {
  fetchTasks,
  createTask,
  updateTaskStatus,
  deleteTask,
  resetTasks,
  TaskState,
  Task,
  TaskStatus,
} from "../features/taskSlice";
import { AnyAction } from "redux";

interface RootState {
  tasks: TaskState;
}

describe("Task Slice", () => {
  let store: ReturnType<typeof configureStore<{ tasks: TaskState }>>;

  beforeEach(() => {
    store = configureStore<{ tasks: TaskState }>({
      reducer: {
        tasks: tasksReducer,
      },
    });
    localStorage.clear();
    localStorage.setItem("authToken", "fake-token");
    store.dispatch({ type: "tasks/resetTasks" });
  });

  it("should handle initial state", () => {
    const state = (store.getState() as RootState).tasks;
    expect(state).toEqual({
      items: [],
      status: "idle",
      error: null,
    });
  });

  it("should handle fetchTasks", async () => {
    const mockTasks: Task[] = [
      {
        id: 1,
        title: "Test Task",
        description: "Test Description",
        status: "en_attente" as TaskStatus,
      },
    ];

    global.fetch = jest.fn().mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockTasks),
    } as Response);

    await store.dispatch(fetchTasks() as unknown as AnyAction);
    const state = (store.getState() as RootState).tasks;
    expect(state.items).toEqual(mockTasks);
  });

  it("should handle createTask", async () => {
    const newTask = {
      title: "New Task",
      description: "New Description",
      status: "en_attente" as TaskStatus,
    };

    global.fetch = jest.fn().mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ ...newTask, id: 1 }),
    } as Response);

    await store.dispatch(createTask(newTask) as unknown as AnyAction);
    const state = (store.getState() as RootState).tasks;
    expect(state.items[0]).toEqual(expect.objectContaining(newTask));
  });

  it("should handle updateTaskStatus", async () => {
    const mockTask = {
      id: 1,
      title: "Test Task",
      description: "Test Description",
      status: "en_attente",
    };

    // Initialiser l'état avec la tâche
    store.dispatch(fetchTasks.fulfilled([mockTask], ""));

    // Vérifier l'état initial
    let state = store.getState().tasks;
    expect(state.items).toHaveLength(1);

    // Mock API pour l'update
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ ...mockTask, status: "en_cours" }),
      })
    ) as jest.Mock;

    // Mettre à jour le status
    await store.dispatch(updateTaskStatus({ id: 1, status: "en_cours" }));

    // Vérifier que le status a été mis à jour
    state = store.getState().tasks;
    expect(state.items[0].status).toBe("en_cours");
  });

  it("should handle deleteTask", async () => {
    const taskId = 1;
    global.fetch = jest.fn().mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ id: taskId }),
    } as Response);

    await store.dispatch(deleteTask(taskId) as unknown as AnyAction);
    const state = (store.getState() as RootState).tasks;
    expect(state.items.find((t) => t.id === taskId)).toBeUndefined();
  });

  it("should handle resetTasks", () => {
    store.dispatch(resetTasks());
    const state = (store.getState() as RootState).tasks;
    expect(state).toEqual({
      items: [],
      status: "idle",
      error: null,
    });
  });
});
