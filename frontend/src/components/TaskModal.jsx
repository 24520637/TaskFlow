import { TaskForm } from "./TaskForm";

export function TaskModal({ task, categories, onSubmit, onCancel, isSaving }) {
  const isEditing = Boolean(task?.id);

  return (
    <div className="modal-backdrop" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && onCancel()}>
      <section className="task-modal" role="dialog" aria-modal="true" aria-labelledby="task-modal-title">
        <div className="task-modal__header"><div><p className="eyebrow">{isEditing ? "Refine the plan" : "Make a plan"}</p><h2 id="task-modal-title">{isEditing ? "Edit task" : "New task"}</h2></div><button className="close-button" aria-label="Close task form" onClick={onCancel}>×</button></div>
        <TaskForm task={task} categories={categories} onSubmit={onSubmit} onCancel={onCancel} isSaving={isSaving} />
      </section>
    </div>
  );
}