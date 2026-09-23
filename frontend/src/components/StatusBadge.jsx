const labels = {
  pending: "To do",
  in_progress: "In progress",
  completed: "Completed"
};

export function StatusBadge({ status }) {
  return <span className={`status-badge status-badge--${status}`}>{labels[status] || status}</span>;
}