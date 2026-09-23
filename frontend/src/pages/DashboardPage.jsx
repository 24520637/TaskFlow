import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { LogoMark } from "../components/LogoMark";
import { TaskFilters } from "../components/TaskFilters";
import { TaskList } from "../components/TaskList";
import { TaskModal } from "../components/TaskModal";
import { CalendarView } from "../components/CalendarView";
import { DashboardSummary } from "../components/DashboardSummary";
import { categoryApi, taskApi } from "../services/api";
import { toLocalDateTimeValue } from "../services/calendar";
import { useAuth } from "../context/AuthContext";

const initialFilters = { search: "", status: "all", priority: "all", category: "all" };

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
  const [calendarDate, setCalendarDate] = useState(() => new Date());
  const [calendarView, setCalendarView] = useState("week");
  const [workspaceView, setWorkspaceView] = useState("calendar");
  const firstName = user?.name?.split(" ")[0] || "there";

  useEffect(() => {
    Promise.all([taskApi.list(token), categoryApi.list(token)])
      .then(([taskResult, categoryResult]) => { setTasks(taskResult.tasks); setCategories(categoryResult.categories); })
      .catch((loadError) => setError(loadError.message))
      .finally(() => setIsLoading(false));
  }, [token]);

  const visibleTasks = useMemo(() => tasks.filter((task) => {
    const query = filters.search.trim().toLowerCase();
    const matchesSearch = !query || task.title.toLowerCase().includes(query) || task.description?.toLowerCase().includes(query);
    return matchesSearch && (filters.status === "all" || task.status === filters.status) && (filters.priority === "all" || task.priority === filters.priority) && (filters.category === "all" || String(task.category_id) === filters.category);
  }), [tasks, filters]);

  function handleSignOut() { signOut(); navigate("/login", { replace: true }); }
  function updateFilters(changes) { setFilters((current) => ({ ...current, ...changes })); }

  async function saveTask(payload) {
    setIsSaving(true); setError("");
    try {
      const result = modalTask?.id ? await taskApi.update(token, modalTask.id, payload) : await taskApi.create(token, payload);
      setTasks((current) => modalTask ? current.map((task) => task.id === result.task.id ? result.task : task) : [result.task, ...current]);
      setModalTask(undefined);
    } catch (saveError) { setError(saveError.message); } finally { setIsSaving(false); }
  }

  async function deleteTask(task) {
    if (!window.confirm(`Delete “${task.title}”?`)) return;
    try { await taskApi.remove(token, task.id); setTasks((current) => current.filter((item) => item.id !== task.id)); } catch (deleteError) { setError(deleteError.message); }
  }

  async function completeTask(task) {
    try { const result = await taskApi.update(token, task.id, { status: "completed" }); setTasks((current) => current.map((item) => item.id === result.task.id ? result.task : item)); } catch (completeError) { setError(completeError.message); }
  }

  function createTaskAt(date) {
    setError("");
    setModalTask({ start_datetime: toLocalDateTimeValue(date) });
  }

  return (
    <main className="app-shell">
      <header className="app-header"><LogoMark /><div className="app-header__right"><div className="user-chip"><span>{user?.name?.charAt(0).toUpperCase()}</span><strong>{user?.name}</strong></div><button className="text-button" onClick={handleSignOut}>Log out <span aria-hidden="true">↗</span></button></div></header>
      <section className="tasks-hero"><div><p className="eyebrow">Your workspace</p><h1>Good morning,<br /><em>{firstName}.</em></h1></div><button className="button button--primary add-task-button" onClick={() => { setError(""); setModalTask(null); }}><span className="add-task-button__plus">+</span> Add task</button></section>
      {!isLoading && <DashboardSummary tasks={tasks} onSelectTask={(task) => setModalTask(task)} />}
      <section className="task-workspace"><div className="workspace-heading"><div><p className="eyebrow">{tasks.length} total</p><h2>{workspaceView === "calendar" ? "Your schedule" : "Your tasks"}</h2></div><div className="workspace-heading__tools"><span className="workspace-heading__note">Keep the next thing visible.</span><div className="workspace-switcher" role="tablist"><button className={workspaceView === "calendar" ? "is-active" : ""} onClick={() => setWorkspaceView("calendar")}>Calendar</button><button className={workspaceView === "list" ? "is-active" : ""} onClick={() => setWorkspaceView("list")}>List</button></div></div></div>{workspaceView === "list" && <TaskFilters filters={filters} categories={categories} onChange={updateFilters} />}{error && <div className="form-error task-page-error" role="alert">{error}</div>}{isLoading ? <div className="empty-state"><span className="loading-dot">· · ·</span><p>Loading your tasks...</p></div> : workspaceView === "calendar" ? <CalendarView date={calendarDate} view={calendarView} tasks={visibleTasks} onViewChange={setCalendarView} onDateChange={setCalendarDate} onToday={() => setCalendarDate(new Date())} onSelectTask={(task) => setModalTask(task)} onCreateAt={createTaskAt} /> : <TaskList tasks={visibleTasks} categories={categories} onEdit={(task) => setModalTask(task)} onDelete={deleteTask} onComplete={completeTask} />}</section>
      {modalTask !== undefined && <TaskModal task={modalTask} categories={categories} onSubmit={saveTask} onCancel={() => setModalTask(undefined)} isSaving={isSaving} />}
    </main>
  );
}
