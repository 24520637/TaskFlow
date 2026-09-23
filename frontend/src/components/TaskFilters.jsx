export function TaskFilters({ filters, categories, onChange }) {
  return (
    <div className="task-filters" aria-label="Task filters">
      <label className="search-field">
        <span aria-hidden="true">⌕</span>
        <input
          type="search"
          placeholder="Search tasks"
          value={filters.search}
          onChange={(event) => onChange({ search: event.target.value })}
        />
      </label>
      <select aria-label="Filter by status" value={filters.status} onChange={(event) => onChange({ status: event.target.value })}>
        <option value="all">All status</option>
        <option value="pending">To do</option>
        <option value="in_progress">In progress</option>
        <option value="completed">Completed</option>
      </select>
      <select aria-label="Filter by priority" value={filters.priority} onChange={(event) => onChange({ priority: event.target.value })}>
        <option value="all">All priority</option>
        <option value="high">High</option>
        <option value="medium">Medium</option>
        <option value="low">Low</option>
      </select>
      <select aria-label="Filter by category" value={filters.category} onChange={(event) => onChange({ category: event.target.value })}>
        <option value="all">All categories</option>
        {categories.map((category) => <option key={category.id} value={category.id}>{category.name}</option>)}
      </select>
    </div>
  );
}