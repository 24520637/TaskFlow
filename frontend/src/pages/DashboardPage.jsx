import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { LogoMark } from "../components/LogoMark";
import { TaskFilters } from "../components/TaskFilters";
import { TaskList } from "../components/TaskList";
import { TaskModal } from "../components/TaskModal";
import { CalendarView } from "../components/CalendarView";
import { DashboardSummary } from "../components/DashboardSummary";
import { ConfirmDialog } from "../components/ConfirmDialog";
import { categoryApi, taskApi } from "../services/api";
import { toLocalDateTimeValue } from "../services/calendar";
import { useAuth } from "../context/AuthContext";
import { useDebouncedValue } from "../hooks/useDebouncedValue";

const initialFilters = { search: "", status: "all", priority: "all", category: "all", date: "all" };

export function DashboardPage() {
  const navigate = useNavigate();
  const { user, token, signOut } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [filters, setFilters] = useState(initialFilters);
  const [modalTask, setModalTask] = useState(undefined);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");
  const [feedback, setFeedback] = useState("");
  const [confirmTask, setConfirmTask] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [calendarDate, setCalendarDate] = useState(() => new Date());
  const [calendarView, setCalendarView] = useState("week");
  const [workspaceView, setWorkspaceView] = useState("calendar");
  const debouncedSearch = useDebouncedValue(filters.search);
  const firstName = user?.name?.split(" ")[0] || "there";

  useEffect(() => {
    Promise.all([taskApi.list(token), categoryApi.list(token)])
      .then(([taskResult, categoryResult]) => { setTasks(taskResult.tasks); setCategories(categoryResult.categories); })
      .catch((loadError) => setError(loadError.message))
      .finally(() => setIsLoading(false));
  }, [token]);

  const visibleTasks = useMemo(() => tasks.filter((task) => {
    const query = debouncedSearch.trim().toLowerCase();
    const matchesSearch = !query || task.title.toLowerCase().includes(query) || task.description?.toLowerCase().includes(query);
    const matchesStatus = filters.status === "all" || task.status === filters.status;
    const matchesPriority = filters.priority === "all" || task.priority === filters.priority;
    const matchesCategory = filters.category === "all" || String(task.category_id) === filters.category;
    const taskDate = task.start_datetime ? new Date(task.start_datetime) : null;
    const deadline = task.deadline ? new Date(task.deadline) : null;
    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const tomorrowStart = new Date(todayStart);
    tomorrowStart.setDate(tomorrowStart.getDate() + 1);
    const matchesDate = filters.date === "all"
      || (filters.date === "today" && ((taskDate && taskDate >= todayStart && taskDate < tomorrowStart) || (deadline && deadline >= todayStart && deadline < tomorrowStart)))
      || (filters.date === "upcoming" && ((taskDate && taskDate >= tomorrowStart) || (deadline && deadline >= tomorrowStart)))
      || (filters.date === "overdue" && task.status !== "completed" && deadline && deadline < now)
      || (filters.date === "no_date" && !taskDate && !deadline);
    return matchesSearch && matchesStatus && matchesPriority && matchesCategory && matchesDate;
  }), [tasks, filters, debouncedSearch]);

  function handleSignOut() { signOut(); navigate("/login", { replace: true }); }
  function updateFilters(changes) { setFilters((current) => ({ ...current, ...changes })); }

  async function saveTask(payload) {
    setIsSaving(true); setError(""); setFeedback("");
    try {
      const result = modalTask?.id ? await taskApi.update(token, modalTask.id, payload) : await taskApi.create(token, payload);
      setTasks((current) => modalTask ? current.map((task) => task.id === result.task.id ? result.task : task) : [result.task, ...current]);
      setModalTask(undefined);
      setFeedback(modalTask?.id ? "Task updated" : "Task added to your workspace");
    } catch (saveError) { setError(saveError.message); } finally { setIsSaving(false); }
  }

  async function deleteTask() {
    if (!confirmTask) return;
    setIsDeleting(true); setError(""); setFeedback("");
    try {
      await taskApi.remove(token, confirmTask.id);
      setTasks((current) => current.filter((item) => item.id !== confirmTask.id));
      setFeedback("Task deleted");
      setConfirmTask(null);
    } catch (deleteError) { setError(deleteError.message); } finally { setIsDeleting(false); }
  }

  async function completeTask(task) {
    setError(""); setFeedback("");
    try { const result = await taskApi.update(token, task.id, { status: "completed" }); setTasks((current) => current.map((item) => item.id === result.task.id ? result.task : item)); setFeedback("Task marked complete"); } catch (completeError) { setError(completeError.message); }
  }

  function createTaskAt(date) {
    setError("");
    setModalTask({ start_datetime: toLocalDateTimeValue(date) });
  }

  return (
    <main className="app-shell">
      <header className="app-header"><LogoMark /><div className="app-header__right"><div className="user-chip"><span>{user?.name?.charAt(0).toUpperCase()}</span><strong>{user?.name}</strong></div><button className="text-button" onClick={handleSignOut}>Log out <span aria-hidden="true">↗</span></button></div></header>
      <section className="tasks-hero"><div><p className="eyebrow">Your workspace</p><h1>Good morning,<br /><em>{firstName}.</em></h1></div><button className="button button--primary add-task-button" onClick={() => { setError(""); setModalTask(null); }}><span className="add-task-button__plus">+</span> Add task</button></section>
      {!isLoading && <DashboardSummary tasks={visibleTasks} onSelectTask={(task) => setModalTask(task)} />}
      <section className="task-workspace" aria-busy={isLoading}><div className="workspace-heading"><div><p className="eyebrow">{visibleTasks.length} of {tasks.length} shown</p><h2>{workspaceView === "calendar" ? "Your schedule" : "Your tasks"}</h2></div><div className="workspace-heading__tools"><span className="workspace-heading__note">Keep the next thing visible.</span><div className="workspace-switcher" role="tablist" aria-label="Workspace view"><button role="tab" aria-selected={workspaceView === "calendar"} className={workspaceView === "calendar" ? "is-active" : ""} onClick={() => setWorkspaceView("calendar")}>Calendar</button><button role="tab" aria-selected={workspaceView === "list"} className={workspaceView === "list" ? "is-active" : ""} onClick={() => setWorkspaceView("list")}>List</button></div></div></div><TaskFilters filters={filters} categories={categories} onChange={updateFilters} onClear={() => { setFilters(initialFilters); setFeedback("Filters cleared"); }} />{error && <div className="form-error task-page-error" role="alert">{error}</div>}{feedback && <div className="form-success task-page-feedback" role="status">{feedback}<button type="button" aria-label="Dismiss notification" onClick={() => setFeedback("")}>×</button></div>}{isLoading ? <div className="empty-state" role="status"><span className="loading-dot">· · ·</span><p>Loading your tasks...</p></div> : workspaceView === "calendar" ? <CalendarView date={calendarDate} view={calendarView} tasks={visibleTasks} onViewChange={setCalendarView} onDateChange={setCalendarDate} onToday={() => setCalendarDate(new Date())} onSelectTask={(task) => setModalTask(task)} onCreateAt={createTaskAt} /> : <TaskList tasks={visibleTasks} categories={categories} onEdit={(task) => setModalTask(task)} onDelete={(task) => setConfirmTask(task)} onComplete={completeTask} />}</section>
      {modalTask !== undefined && <TaskModal task={modalTask} categories={categories} onSubmit={saveTask} onCancel={() => setModalTask(undefined)} isSaving={isSaving} />}
      {confirmTask && <ConfirmDialog title="Delete this task?" message={`“${confirmTask.title}” will be removed from your workspace.`} onCancel={() => setConfirmTask(null)} onConfirm={deleteTask} isBusy={isDeleting} />}
    </main>
  );
}
