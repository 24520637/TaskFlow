import { TaskCard } from "./TaskCard";

export function TaskList({ tasks, categories, onEdit, onDelete, onComplete }) {
  const categoryMap = Object.fromEntries(categories.map((category) => [category.id, category.name]));

  if (!tasks.length) {
    return <div className="empty-state"><span>✳</span><h3>No tasks match this view.</h3><p>Try another filter or add something new to your list.</p></div>;
  }

  return <div className="task-list">{tasks.map((task) => <TaskCard key={task.id} task={task} categoryName={categoryMap[task.category_id]} onEdit={onEdit} onDelete={onDelete} onComplete={onComplete} />)}</div>;
}