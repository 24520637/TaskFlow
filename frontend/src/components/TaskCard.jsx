import { PriorityBadge } from "./PriorityBadge";
import { StatusBadge } from "./StatusBadge";

function formatDate(value) {
  if (!value) return "No date set";
  return new Intl.DateTimeFormat("en", { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" }).format(new Date(value));
}

export function TaskCard({ task, categoryName, onEdit, onDelete, onComplete }) {
  const isComplete = task.status === "completed";

  return (
    <article className={`task-card${isComplete ? " task-card--complete" : ""}`}>
      <button className="task-check" aria-label={isComplete ? "Task completed" : `Mark ${task.title} completed`} onClick={() => onComplete(task)} disabled={isComplete}>
        {isComplete ? "✓" : ""}
      </button>
      <div className="task-card__body">
        <div className="task-card__topline">
          <StatusBadge status={task.status} />
          {categoryName && <span className="category-label">{categoryName}</span>}
        </div>
        <h3>{task.title}</h3>
        {task.description && <p>{task.description}</p>}
        <div className="task-card__meta"><span>◷ {formatDate(task.start_datetime)}</span><PriorityBadge priority={task.priority} /></div>
      </div>
      <div className="task-card__actions">
        <button aria-label={`Edit ${task.title}`} onClick={() => onEdit(task)}>Edit</button>
        <button aria-label={`Delete ${task.title}`} onClick={() => onDelete(task)}>Delete</button>
      </div>
    </article>
  );
}