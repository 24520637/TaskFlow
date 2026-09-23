const {
    createTask,
    findTasksByUser,
    findTaskById,
    updateTask,
    deleteTask
} = require("../services/taskService");

const priorities = new Set(["low", "medium", "high"]);
const statuses = new Set(["pending", "in_progress", "completed"]);

function validationError(message) {
    const error = new Error(message);
    error.statusCode = 400;
    return error;
}

function parseTaskId(value) {
    const taskId = Number(value);

    if (!Number.isInteger(taskId) || taskId < 1) {
        throw validationError("Task ID must be a positive integer");
    }

    return taskId;
}

function parseDatetime(value, fieldName) {
    if (value === null || value === undefined || value === "") {
        return null;
    }

    if (typeof value !== "string" || Number.isNaN(Date.parse(value))) {
        throw validationError(`${fieldName} must be a valid datetime`);
    }

    return value;
}

function parseCategoryId(value) {
    if (value === null || value === undefined || value === "") {
        return null;
    }

    const categoryId = Number(value);

    if (!Number.isInteger(categoryId) || categoryId < 1) {
        throw validationError("category_id must be a positive integer or null");
    }

    return categoryId;
}

function validateTaskInput(body, partial = false) {
    const input = body || {};
    const task = {};

    if (!partial || input.title !== undefined) {
        if (typeof input.title !== "string" || !input.title.trim()) {
            throw validationError("title is required");
        }

        task.title = input.title.trim();
    }

    if (!partial || input.description !== undefined) {
        if (input.description !== null && typeof input.description !== "string") {
            throw validationError("description must be a string or null");
        }

        task.description = input.description || null;
    }

    if (!partial || input.start_datetime !== undefined) {
        task.startDatetime = parseDatetime(input.start_datetime, "start_datetime");
    }

    if (!partial || input.end_datetime !== undefined) {
        task.endDatetime = parseDatetime(input.end_datetime, "end_datetime");
    }

    if (task.startDatetime && task.endDatetime && Date.parse(task.startDatetime) > Date.parse(task.endDatetime)) {
        throw validationError("end_datetime must be after start_datetime");
    }

    if (!partial || input.deadline !== undefined) {
        task.deadline = parseDatetime(input.deadline, "deadline");
    }

    if (task.deadline && task.startDatetime && Date.parse(task.deadline) < Date.parse(task.startDatetime)) {
        throw validationError("deadline must be on or after start_datetime");
    }

    if (!partial || input.priority !== undefined) {
        task.priority = input.priority === undefined ? "medium" : input.priority;

        if (!priorities.has(task.priority)) {
            throw validationError("priority must be low, medium, or high");
        }
    }

    if (!partial || input.status !== undefined) {
        task.status = input.status === undefined ? "pending" : input.status;

        if (!statuses.has(task.status)) {
            throw validationError("status must be pending, in_progress, or completed");
        }
    }

    if (!partial || input.category_id !== undefined) {
        task.categoryId = parseCategoryId(input.category_id);
    }

    return task;
}

function handleMissingTask(res) {
    res.status(404).json({ error: "Task not found" });
}

async function create(req, res, next) {
    try {
        const task = validateTaskInput(req.body);
        const createdTask = await createTask(req.user.id, task);
        res.status(201).json({ task: createdTask });
    } catch (error) {
        next(error);
    }
}

async function list(req, res, next) {
    try {
        const tasks = await findTasksByUser(req.user.id);
        res.status(200).json({ tasks });
    } catch (error) {
        next(error);
    }
}

async function getOne(req, res, next) {
    try {
        const task = await findTaskById(req.user.id, parseTaskId(req.params.id));

        if (!task) {
            return handleMissingTask(res);
        }

        return res.status(200).json({ task });
    } catch (error) {
        return next(error);
    }
}

async function update(req, res, next) {
    try {
        const task = await updateTask(
            req.user.id,
            parseTaskId(req.params.id),
            validateTaskInput(req.body, true)
        );

        if (!task) {
            return handleMissingTask(res);
        }

        return res.status(200).json({ task });
    } catch (error) {
        return next(error);
    }
}

async function remove(req, res, next) {
    try {
        const deleted = await deleteTask(req.user.id, parseTaskId(req.params.id));

        if (!deleted) {
            return handleMissingTask(res);
        }

        return res.status(204).send();
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