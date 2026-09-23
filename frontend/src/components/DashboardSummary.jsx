import { formatTime } from "../services/calendar";

function isSameDay(left, right) {
  return left.getFullYear() === right.getFullYear()
    && left.getMonth() === right.getMonth()
    && left.getDate() === right.getDate();
}

function formatDate(value) {
  return new Intl.DateTimeFormat("en", { month: "short", day: "numeric" }).format(new Date(value));
}

function DeadlineList({ tasks }) {
  if (!tasks.length) {
    return <p className="summary-empty">No upcoming deadlines.</p>;
  }

  return (
    <div className="deadline-list">
      {tasks.map((task) => (
        <div className="deadline-row" key={task.id}>
          <span className="deadline-row__date">{formatDate(task.deadline)}</span>
          <strong>{task.title}</strong>
          <span>{formatTime(task.deadline)}</span>
        </div>
      ))}
    </div>
  );
}

export function DashboardSummary({ tasks, onSelectTask }) {
  const now = new Date();
  const todayTasks = tasks.filter((task) => task.start_datetime && isSameDay(new Date(task.start_datetime), now));
  const completedTasks = tasks.filter((task) => task.status === "completed");
  const inProgressTasks = tasks.filter((task) => task.status === "in_progress");
  const overdueTasks = tasks.filter((task) => task.status !== "completed" && task.deadline && new Date(task.deadline) < now);
  const upcomingDeadlines = tasks
    .filter((task) => task.status !== "completed" && task.deadline && new Date(task.deadline) >= now)
    .sort((left, right) => new Date(left.deadline) - new Date(right.deadline))
    .slice(0, 4);
  const completionRate = tasks.length ? Math.round((completedTasks.length / tasks.length) * 100) : 0;
  const highPriorityTasks = tasks.filter((task) => task.priority === "high" && task.status !== "completed").length;

  return (
    <section className="dashboard-summary" aria-label="Task summary">
      <div className="summary-card summary-card--today">
        <span className="summary-card__label">Today</span>
        <strong>{todayTasks.length}</strong>
        <small>{todayTasks.length === 1 ? "task scheduled" : "tasks scheduled"}</small>
      </div>
      <div className="summary-card summary-card--overdue">
        <span className="summary-card__label">Overdue</span>
        <strong>{overdueTasks.length}</strong>
        <small>{overdueTasks.length ? "needs attention" : "you are all caught up"}</small>
      </div>
      <div className="summary-card">
        <span className="summary-card__label">Completed</span>
        <strong>{completedTasks.length}</strong>
        <small>of {tasks.length} total tasks</small>
      </div>
      <div className="summary-card summary-card--progress">
        <span className="summary-card__label">In progress</span>
        <strong>{inProgressTasks.length}</strong>
        <small>{highPriorityTasks} high priority remaining</small>
      </div>
      <div className="summary-detail summary-detail--rate">
        <div className="summary-detail__heading"><div><span className="summary-card__label">Completion rate</span><strong>{completionRate}%</strong></div><span className="summary-ring" style={{ "--completion": `${completionRate}%` }} /></div>
        <div className="completion-track"><span style={{ width: `${completionRate}%` }} /></div>
        <small>Based on the tasks in this view</small>
      </div>
      <div className="summary-detail summary-detail--deadlines">
        <div className="summary-detail__heading"><div><span className="summary-card__label">Upcoming deadlines</span><strong>{upcomingDeadlines.length ? "Stay ahead" : "Clear horizon"}</strong></div><span className="summary-detail__count">{upcomingDeadlines.length}</span></div>
        <DeadlineList tasks={upcomingDeadlines} />
      </div>
      {overdueTasks.length > 0 && <button className="summary-alert" onClick={() => onSelectTask(overdueTasks[0])}><span>!</span><div><strong>{overdueTasks.length} overdue {overdueTasks.length === 1 ? "task" : "tasks"}</strong><small>Open the oldest one to get moving.</small></div><b>↗</b></button>}
    </section>
  );
}
