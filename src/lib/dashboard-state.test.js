import { describe, expect, test } from "bun:test";
import { dashboardReducer, initialDashboard } from "./dashboard-state";
import { lunchDates } from "./lunch-plan";

describe("dashboard points", () => {
  test("booking deducts 50 only once", () => {
    const state = dashboardReducer(initialDashboard, { type: "book", key: "Today-0" });
    expect(state.points).toBe(320);
    expect(dashboardReducer(state, { type: "book", key: "Today-0" }).points).toBe(320);
  });
  test("plate updates counters and cannot earn again through the task", () => {
    const state = dashboardReducer(initialDashboard, { type: "plate" });
    expect([state.points, state.mealsSaved, state.cleanPlates]).toEqual([470, 33, 29]);
    expect(dashboardReducer(state, { type: "task", index: 1 }).points).toBe(470);
  });
  test("completed tasks cannot repeatedly earn points", () => {
    const state = dashboardReducer(initialDashboard, { type: "task", index: 0 });
    expect(state.points).toBe(420);
    expect(dashboardReducer(state, { type: "task", index: 0 }).points).toBe(420);
  });
  test("insufficient funds cannot produce negative points", () => {
    expect(dashboardReducer(initialDashboard, { type: "plan", cost: 900 }).points).toBe(370);
    expect(dashboardReducer({ ...initialDashboard, points: 0 }, { type: "book", key: "Today-0" }).points).toBe(0);
  });
  test("inclusive weekday count uses real dates", () => {
    expect(lunchDates(new Date(2026, 9, 7), new Date(2026, 9, 31), [1, 2, 3, 4, 5]).length).toBe(18);
    expect(lunchDates(new Date(2026, 9, 7), new Date(2026, 9, 7), [3]).length).toBe(1);
    expect(lunchDates(new Date(2026, 9, 8), new Date(2026, 9, 7), [3]).length).toBe(0);
  });
});