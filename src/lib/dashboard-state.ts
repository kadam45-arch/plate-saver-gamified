export const initialDashboard = {
  points: 370,
  mealsSaved: 32,
  cleanPlates: 28,
  booked: {} as Record<string, boolean>,
  tasks: [
    { t: "Pre-book today's lunch", done: false, pts: 50 },
    { t: "Upload a clean plate", done: false, pts: 100 },
    { t: "Skip a second helping", done: false, pts: 10 },
    { t: "Share a tip in Community", done: false, pts: 10 },
  ],
};
type Action = { type: "book"; key: string } | { type: "plate" } | { type: "plan"; cost: number } | { type: "task"; index: number } | { type: "redeem"; cost: number };
export function dashboardReducer(state: typeof initialDashboard, action: Action): typeof initialDashboard {
  if (action.type === "book") {
    if (state.booked[action.key] || state.points < 50) return state;
    return { ...state, points: state.points - 50, booked: { ...state.booked, [action.key]: true } };
  }
  if (action.type === "plate") return { ...state, points: state.points + 100, mealsSaved: state.mealsSaved + 1, cleanPlates: state.cleanPlates + 1, tasks: state.tasks.map((task, i) => i === 1 ? { ...task, done: true } : task) };
  if (action.type === "plan" || action.type === "redeem") return action.cost > state.points ? state : { ...state, points: state.points - action.cost };
  const task = state.tasks[action.index];
  if (!task || task.done || action.index === 1) return state;
  return { ...state, points: state.points + task.pts, tasks: state.tasks.map((value, i) => i === action.index ? { ...value, done: true } : value) };
}