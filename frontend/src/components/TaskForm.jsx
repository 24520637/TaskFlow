import { useState } from "react";
import { CategorySelector } from "./CategorySelector";

function toInputValue(value) {
  return value ? value.slice(0, 16) : "";
}

export function TaskForm({ task, categories, onSubmit, onCancel, isSaving }) {
  const [form, setForm] = useState({
    title: task?.title || "",
    description: task?.description || "",
    start_datetime: toInputValue(task?.start_datetime),
    end_datetime: toInputValue(task?.end_datetime),
    deadline: toInputValue(task?.deadline),
    priority: task?.priority || "medium",
    status: task?.status || "pending",
    category_id: task?.category_id || null
  });

  function update(name, value) { setForm((current) => ({ ...current, [name]: value })); }

  function submit(event) {
    event.preventDefault();
    onSubmit({ ...form, category_id: form.category_id || null, start_datetime: form.start_datetime || null, end_datetime: form.end_datetime || null, deadline: form.deadline || null });
  }

  return (
    <form className="task-form" onSubmit={submit}>
      <label className="task-field task-field--wide"><span>Task title</span><input autoFocus required value={form.title} onChange={(event) => update("title", event.target.value)} placeholder="What needs your attention?" /></label>
      <label className="task-field task-field--wide"><span>Description <small>Optional</small></span><textarea rows="3" value={form.description} onChange={(event) => update("description", event.target.value)} placeholder="Add a little context..." /></label>
      <div className="task-form__grid"><label className="task-field"><span>Start</span><input type="datetime-local" value={form.start_datetime} onChange={(event) => update("start_datetime", event.target.value)} /></label><label className="task-field"><span>End</span><input type="datetime-local" value={form.end_datetime} onChange={(event) => update("end_datetime", event.target.value)} /></label></div>
      <div className="task-form__grid"><label className="task-field"><span>Deadline</span><input type="datetime-local" value={form.deadline} onChange={(event) => update("deadline", event.target.value)} /></label><CategorySelector categories={categories} value={form.category_id} onChange={(value) => update("category_id", value)} /></div>
      <div className="task-form__grid"><label className="task-field"><span>Priority</span><select value={form.priority} onChange={(event) => update("priority", event.target.value)}><option value="low">Low</option><option value="medium">Medium</option><option value="high">High</option></select></label><label className="task-field"><span>Status</span><select value={form.status} onChange={(event) => update("status", event.target.value)}><option value="pending">To do</option><option value="in_progress">In progress</option><option value="completed">Completed</option></select></label></div>
      <div className="task-form__actions"><button type="button" className="button button--quiet" onClick={onCancel}>Cancel</button><button type="submit" className="button button--primary" disabled={isSaving}>{isSaving ? "Saving..." : task ? "Save changes" : "Add task"}<span aria-hidden="true">↗</span></button></div>
    </form>
  );
}