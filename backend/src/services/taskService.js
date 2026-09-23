const { pool } = require("../config/database");

const taskColumns = `
    id,
    user_id,
    category_id,
    title,
    description,
    start_datetime,
    end_datetime,
    deadline,
    priority,
    status,
    created_at,
    updated_at
`;

async function categoryBelongsToUser(categoryId, userId) {
    if (categoryId === null) {
        return true;
    }

    const [categories] = await pool.execute(
        "SELECT id FROM categories WHERE id = ? AND user_id = ? LIMIT 1",
        [categoryId, userId]
    );

    return categories.length > 0;
}

async function createTask(userId, task) {
    if (!(await categoryBelongsToUser(task.categoryId, userId))) {
        const error = new Error("Category not found");
        error.statusCode = 400;
        throw error;
    }

    const [result] = await pool.execute(
        `INSERT INTO tasks
            (user_id, category_id, title, description, start_datetime, end_datetime, deadline, priority, status)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
            userId,
            task.categoryId,
            task.title,
            task.description,
            task.startDatetime,
            task.endDatetime,
            task.deadline,
            task.priority,
            task.status
        ]
    );

    return findTaskById(userId, result.insertId);
}

async function findTasksByUser(userId) {
    const [tasks] = await pool.execute(
        `SELECT ${taskColumns} FROM tasks WHERE user_id = ? ORDER BY start_datetime ASC, id ASC`,
        [userId]
    );

    return tasks;
}

async function findTaskById(userId, taskId) {
    const [tasks] = await pool.execute(
        `SELECT ${taskColumns} FROM tasks WHERE id = ? AND user_id = ? LIMIT 1`,
        [taskId, userId]
    );

    return tasks[0] || null;
}

async function updateTask(userId, taskId, task) {
    if (task.categoryId !== undefined && !(await categoryBelongsToUser(task.categoryId, userId))) {
        const error = new Error("Category not found");
        error.statusCode = 400;
        throw error;
    }

    const updates = [];
    const values = [];
    const fields = [
        ["category_id", task.categoryId],
        ["title", task.title],
        ["description", task.description],
        ["start_datetime", task.startDatetime],
        ["end_datetime", task.endDatetime],
        ["deadline", task.deadline],
        ["priority", task.priority],
        ["status", task.status]
    ];

    for (const [column, value] of fields) {
        if (value !== undefined) {
            updates.push(`${column} = ?`);
            values.push(value);
        }
    }

    if (updates.length === 0) {
        return findTaskById(userId, taskId);
    }

    values.push(taskId, userId);
    const [result] = await pool.execute(
        `UPDATE tasks SET ${updates.join(", ")} WHERE id = ? AND user_id = ?`,
        values
    );

    if (result.affectedRows === 0) {
        return null;
    }

    return findTaskById(userId, taskId);
}

async function deleteTask(userId, taskId) {
    const [result] = await pool.execute(
        "DELETE FROM tasks WHERE id = ? AND user_id = ?",
        [taskId, userId]
    );

    return result.affectedRows > 0;
}

module.exports = {
    createTask,
    findTasksByUser,
    findTaskById,
    updateTask,
    deleteTask
};