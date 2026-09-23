export function CategorySelector({ categories, value, onChange }) {
  return (
    <label className="task-field">
      <span>Category</span>
      <select value={value ?? ""} onChange={(event) => onChange(event.target.value ? Number(event.target.value) : null)}>
        <option value="">No category</option>
        {categories.map((category) => <option key={category.id} value={category.id}>{category.name}</option>)}
      </select>
    </label>
  );
}