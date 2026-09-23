export function startOfDay(date) {
  const result = new Date(date);
  result.setHours(0, 0, 0, 0);
  return result;
}

export function addDays(date, amount) {
  const result = new Date(date);
  result.setDate(result.getDate() + amount);
  return result;
}

export function startOfWeek(date) {
  const result = startOfDay(date);
  result.setDate(result.getDate() - result.getDay());
  return result;
}

export function startOfMonth(date) {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

export function formatDateKey(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function taskDateKey(task) {
  return task.start_datetime ? formatDateKey(new Date(task.start_datetime)) : null;
}

export function tasksForDate(tasks, date) {
  const key = formatDateKey(date);
  return tasks.filter((task) => taskDateKey(task) === key);
}

export function formatTime(value) {
  if (!value) return "No time";
  return new Intl.DateTimeFormat("en", { hour: "numeric", minute: "2-digit" }).format(new Date(value));
}

export function formatMonthYear(date) {
  return new Intl.DateTimeFormat("en", { month: "long", year: "numeric" }).format(date);
}

export function formatRange(start, end) {
  const sameMonth = start.getMonth() === end.getMonth();
  const startText = new Intl.DateTimeFormat("en", { month: "short", day: "numeric" }).format(start);
  const endText = new Intl.DateTimeFormat("en", { month: sameMonth ? undefined : "short", day: "numeric" }).format(end);
  return `${startText} – ${endText}`;
}

export function toLocalDateTimeValue(date) {
  const result = new Date(date);
  result.setMinutes(0, 0, 0);
  const local = new Date(result.getTime() - result.getTimezoneOffset() * 60000);
  return local.toISOString().slice(0, 16);
}
