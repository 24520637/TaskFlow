import { TaskForm } from "./TaskForm";

export function TaskModal({ task, categories, onSubmit, onCancel, isSaving }) {
  return (
    <div className="modal-backdrop" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && onCancel()}>
      <section className="task-modal" role="dialog" aria-modal="true" aria-labelledby="task-modal-title">
        <div className="task-modal__header"><div><p className="eyebrow">{task ? "Refine the plan" : "Make a plan"}</p><h2 id="task-modal-title">{task ? "Edit task" : "New task"}</h2></div><button className="close-button" aria-label="Close task form" onClick={onCancel}>×</button></div>
        <TaskForm task={task} categories={categories} onSubmit={onSubmit} onCancel={onCancel} isSaving={isSaving} />
      </section>
    </div>
  );
}