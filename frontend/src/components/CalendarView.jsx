import { PriorityBadge } from "./PriorityBadge";
import { StatusBadge } from "./StatusBadge";
import {
  addDays,
  formatDateKey,
  formatMonthYear,
  formatRange,
  formatTime,
  startOfDay,
  startOfMonth,
  startOfWeek,
  tasksForDate
} from "../services/calendar";

const hours = Array.from({ length: 17 }, (_, index) => index + 6);
const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function activateWithKeyboard(event, callback) {
  if (event.key === "Enter" || event.key === " ") {
    event.preventDefault();
    callback();
  }
}

function TaskChip({ task, onSelectTask, compact = false }) {
  return (
    <button className={`calendar-task${compact ? " calendar-task--compact" : ""} calendar-task--${task.priority}`} onClick={(event) => { event.stopPropagation(); onSelectTask(task); }}>
      <span className="calendar-task__time">{formatTime(task.start_datetime)}</span>
      <strong>{task.title}</strong>
      <StatusBadge status={task.status} />
      {!compact && <PriorityBadge priority={task.priority} />}
    </button>
  );
}

function DayCalendar({ date, tasks, onSelectTask, onCreateAt }) {
  const dayTasks = tasksForDate(tasks, date);
  return (
    <div className="day-calendar">
      <div className="time-grid">
        <div className="time-grid__corner" />
        <div className="time-grid__day-header"><span>{new Intl.DateTimeFormat("en", { weekday: "long" }).format(date)}</span><strong>{date.getDate()}</strong></div>
        <div className="time-grid__body">
          {hours.map((hour) => <div className="time-row" key={hour}><span className="time-label">{new Intl.DateTimeFormat("en", { hour: "numeric" }).format(new Date(2000, 0, 1, hour))}</span><button className="time-slot" aria-label={`Create task at ${hour}:00`} onClick={() => onCreateAt(new Date(date.getFullYear(), date.getMonth(), date.getDate(), hour))} />{dayTasks.filter((task) => new Date(task.start_datetime).getHours() === hour).map((task) => <TaskChip key={task.id} task={task} onSelectTask={onSelectTask} />)}</div>)}
        </div>
      </div>
    </div>
  );
}

function WeekCalendar({ date, tasks, onSelectTask, onCreateAt }) {
  const weekStart = startOfWeek(date);
  return (
    <div className="week-calendar">
      <div className="week-header"><div className="week-header__spacer" />{weekdays.map((weekday, index) => { const day = addDays(weekStart, index); return <div className={`week-day-header${formatDateKey(day) === formatDateKey(new Date()) ? " is-today" : ""}`} key={weekday}><span>{weekday}</span><strong>{day.getDate()}</strong></div>; })}</div>
      <div className="week-body">{hours.map((hour) => <div className="week-row" key={hour}><span className="time-label">{new Intl.DateTimeFormat("en", { hour: "numeric" }).format(new Date(2000, 0, 1, hour))}</span>{weekdays.map((_, index) => { const day = addDays(weekStart, index); const dayTasks = tasksForDate(tasks, day).filter((task) => new Date(task.start_datetime).getHours() === hour); const createAt = () => onCreateAt(new Date(day.getFullYear(), day.getMonth(), day.getDate(), hour)); return <div className="week-slot" role="button" tabIndex="0" aria-label={`Create task on ${formatDateKey(day)} at ${hour}:00`} key={formatDateKey(day)} onClick={createAt} onKeyDown={(event) => activateWithKeyboard(event, createAt)}>{dayTasks.map((task) => <TaskChip key={task.id} task={task} onSelectTask={onSelectTask} compact />)}</div>; })}</div>)}</div>
    </div>
  );
}

function MonthCalendar({ date, tasks, onSelectTask, onCreateAt }) {
  const monthStart = startOfMonth(date);
  const gridStart = startOfWeek(monthStart);
  const days = Array.from({ length: 42 }, (_, index) => addDays(gridStart, index));
  return (
    <div className="month-calendar"><div className="month-weekdays">{weekdays.map((weekday) => <span key={weekday}>{weekday}</span>)}</div><div className="month-grid">{days.map((day) => { const dayTasks = tasksForDate(tasks, day); const isCurrentMonth = day.getMonth() === date.getMonth(); const isToday = formatDateKey(day) === formatDateKey(new Date()); const createAt = () => onCreateAt(new Date(day.getFullYear(), day.getMonth(), day.getDate(), 9)); return <div className={`month-cell${isCurrentMonth ? "" : " month-cell--muted"}${isToday ? " is-today" : ""}`} role="button" tabIndex="0" key={formatDateKey(day)} onClick={createAt} onKeyDown={(event) => activateWithKeyboard(event, createAt)}><span className="month-cell__date">{day.getDate()}</span>{dayTasks.slice(0, 3).map((task) => <TaskChip key={task.id} task={task} onSelectTask={onSelectTask} compact />)}{dayTasks.length > 3 && <small>+{dayTasks.length - 3} more</small>}</div>; })}</div></div>
  );
}

function AgendaCalendar({ date, tasks, onSelectTask, onCreateAt }) {
  const days = Array.from({ length: 7 }, (_, index) => addDays(startOfDay(date), index));
  return <div className="agenda-calendar">{days.map((day) => <section className="agenda-day" key={formatDateKey(day)}><button className="agenda-day__header" onClick={() => onCreateAt(new Date(day.getFullYear(), day.getMonth(), day.getDate(), 9))}><span>{new Intl.DateTimeFormat("en", { weekday: "long", month: "short", day: "numeric" }).format(day)}</span><b>+</b></button>{tasksForDate(tasks, day).map((task) => <TaskChip key={task.id} task={task} onSelectTask={onSelectTask} />)}{!tasksForDate(tasks, day).length && <button className="agenda-empty" onClick={() => onCreateAt(new Date(day.getFullYear(), day.getMonth(), day.getDate(), 9))}>Add a task</button>}</section>)}</div>;
}

export function CalendarView({ date, view, tasks, onViewChange, onDateChange, onToday, onSelectTask, onCreateAt }) {
  function navigate(direction) {
    const amount = view === "month" ? 1 : view === "week" ? 7 : 1;
    const nextDate = new Date(date);
    nextDate.setDate(nextDate.getDate() + direction * amount);
    onDateChange(nextDate);
  }

  const title = view === "month" ? formatMonthYear(date) : view === "week" ? formatRange(startOfWeek(date), addDays(startOfWeek(date), 6)) : new Intl.DateTimeFormat("en", { weekday: "long", month: "long", day: "numeric", year: "numeric" }).format(date);
  return (
    <section className="calendar-shell">
      <div className="calendar-toolbar"><div className="calendar-nav"><button onClick={() => navigate(-1)} aria-label="Previous period">←</button><button onClick={() => navigate(1)} aria-label="Next period">→</button><button className="today-button" onClick={onToday}>Today</button><h2>{title}</h2></div><div className="view-switcher" role="tablist" aria-label="Calendar view">{["day", "week", "month"].map((option) => <button role="tab" aria-selected={view === option} className={view === option ? "is-active" : ""} key={option} onClick={() => onViewChange(option)}>{option}</button>)}</div></div>
      <div className="calendar-desktop-view">{view === "day" && <DayCalendar date={date} tasks={tasks} onSelectTask={onSelectTask} onCreateAt={onCreateAt} />}{view === "week" && <WeekCalendar date={date} tasks={tasks} onSelectTask={onSelectTask} onCreateAt={onCreateAt} />}{view === "month" && <MonthCalendar date={date} tasks={tasks} onSelectTask={onSelectTask} onCreateAt={onCreateAt} />}</div>
      <div className="calendar-mobile-view"><AgendaCalendar date={view === "month" ? startOfMonth(date) : date} tasks={tasks} onSelectTask={onSelectTask} onCreateAt={onCreateAt} /></div>
    </section>
  );
}