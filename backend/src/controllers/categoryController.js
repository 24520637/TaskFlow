const {
    createCategory,
    findCategoriesByUser,
    findCategoryById,
    updateCategory,
    deleteCategory
} = require("../services/categoryService");

function validationError(message) {
    const error = new Error(message);
    error.statusCode = 400;
    return error;
}

function parseCategoryId(value) {
    const categoryId = Number(value);

    if (!Number.isInteger(categoryId) || categoryId < 1) {
        throw validationError("Category ID must be a positive integer");
    }

    return categoryId;
}

function validateCategoryInput(body) {
    const input = body || {};
    const name = typeof input.name === "string" ? input.name.trim() : "";
    const color = input.color === undefined || input.color === null ? null : String(input.color).trim();

    if (!name) {
        throw validationError("name is required");
    }

    if (name.length > 100) {
        throw validationError("name must be 100 characters or fewer");
    }

    if (color && color.length > 20) {
        throw validationError("color must be 20 characters or fewer");
    }

    return {
        name,
        color: color || null
    };
}

function handleMissingCategory(res) {
    res.status(404).json({ error: "Category not found" });
}

async function create(req, res, next) {
    try {
        const category = await createCategory(req.user.id, validateCategoryInput(req.body));
        res.status(201).json({ category });
    } catch (error) {
        next(error);
    }
}

async function list(req, res, next) {
    try {
        const categories = await findCategoriesByUser(req.user.id);
        res.status(200).json({ categories });
    } catch (error) {
        next(error);
    }
}

async function update(req, res, next) {
    try {
        const category = await updateCategory(
            req.user.id,
            parseCategoryId(req.params.id),
            validateCategoryInput(req.body)
        );

        if (!category) {
            return handleMissingCategory(res);
        }

        return res.status(200).json({ category });
    } catch (error) {
        return next(error);
    }
}

async function remove(req, res, next) {
    try {
        const deleted = await deleteCategory(req.user.id, parseCategoryId(req.params.id));

        if (!deleted) {
            return handleMissingCategory(res);
        }

        return res.status(204).send();
    } catch (error) {
        return next(error);
    }
}

async function getOne(req, res, next) {
    try {
        const category = await findCategoryById(req.user.id, parseCategoryId(req.params.id));

        if (!category) {
            return handleMissingCategory(res);
        }

        return res.status(200).json({ category });
    } catch (error) {
        return next(error);
    }
}

module.exports = {
    create,
    list,
    getOne,
    update,
    remove
};