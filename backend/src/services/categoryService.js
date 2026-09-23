const { pool } = require("../config/database");

const categoryColumns = `
    id,
    user_id,
    name,
    color,
    created_at
`;

async function createCategory(userId, category) {
    try {
        const [result] = await pool.execute(
            "INSERT INTO categories (user_id, name, color) VALUES (?, ?, ?)",
            [userId, category.name, category.color]
        );

        return findCategoryById(userId, result.insertId);
    } catch (error) {
        if (error.code === "ER_DUP_ENTRY") {
            const duplicateError = new Error("Category name already exists");
            duplicateError.statusCode = 409;
            throw duplicateError;
        }

        throw error;
    }
}

async function findCategoriesByUser(userId) {
    const [categories] = await pool.execute(
        `SELECT ${categoryColumns} FROM categories WHERE user_id = ? ORDER BY name ASC, id ASC`,
        [userId]
    );

    return categories;
}

async function findCategoryById(userId, categoryId) {
    const [categories] = await pool.execute(
        `SELECT ${categoryColumns} FROM categories WHERE id = ? AND user_id = ? LIMIT 1`,
        [categoryId, userId]
    );

    return categories[0] || null;
}

async function updateCategory(userId, categoryId, category) {
    try {
        const [result] = await pool.execute(
            "UPDATE categories SET name = ?, color = ? WHERE id = ? AND user_id = ?",
            [category.name, category.color, categoryId, userId]
        );

        if (result.affectedRows === 0) {
            return null;
        }

        return findCategoryById(userId, categoryId);
    } catch (error) {
        if (error.code === "ER_DUP_ENTRY") {
            const duplicateError = new Error("Category name already exists");
            duplicateError.statusCode = 409;
            throw duplicateError;
        }

        throw error;
    }
}

async function deleteCategory(userId, categoryId) {
    const [result] = await pool.execute(
        "DELETE FROM categories WHERE id = ? AND user_id = ?",
        [categoryId, userId]
    );

    return result.affectedRows > 0;
}

module.exports = {
    createCategory,
    findCategoriesByUser,
    findCategoryById,
    updateCategory,
    deleteCategory
};