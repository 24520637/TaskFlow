# TaskFlow - Codex Instructions

## 1. Project

TaskFlow is a web-based task and calendar management system.

The main goal is to help users manage daily tasks,
deadlines, schedules, priorities and task progress.

The product is inspired by the concept of Google Calendar,
but it is not intended to clone Google Calendar.

Target users:
- Students
- Individual users
- People who need daily task planning

---

## 2. Tech Stack

Frontend:
- React
- Vite
- JavaScript

Backend:
- Node.js
- Express.js

Database:
- MySQL

Development:
- Git
- GitHub

---

## 3. Architecture

Frontend:
React
    ↓
REST API
    ↓
Express
    ↓
MySQL

Frontend code is located in:
frontend/

Backend code is located in:
backend/

Database schema is located in:
database/schema.sql

Detailed architecture:
docs/architecture.md

---

## 4. Core Features

MVP:

- User registration
- User login
- Create task
- View task
- Edit task
- Delete task
- Complete task
- Calendar day view
- Calendar week view
- Calendar month view
- Categories
- Priority
- Task status
- Search
- Filtering
- Dashboard

Future features:

- Recurring tasks
- Reminders
- Notifications
- Drag and drop scheduling
- AI-assisted scheduling
- Google Calendar integration

Do not implement future features unless explicitly requested.

---

## 5. Development Rules

- Inspect the existing code before modifying it.
- Reuse existing patterns when possible.
- Do not rewrite working code unnecessarily.
- Do not introduce new libraries unless there is a clear reason.
- Keep implementation simple and maintainable.
- Do not modify unrelated files.
- Keep frontend and backend responsibilities separated.
- Do not put database logic inside React components.
- Do not put all backend logic inside server.js.

---

## 6. Backend Rules

Use this structure:

routes
    ↓
controllers
    ↓
database

Routes define API endpoints.

Controllers handle request/response logic.

Database access should be kept separate from route definitions.

Authentication and authorization should be handled through middleware.

---

## 7. Frontend Rules

Use reusable React components.

Pages should represent application screens.

Reusable UI should be placed in components/.

API communication should be placed in services/.

Do not duplicate API request logic across components.

---

## 8. Database Rules

Use MySQL.

Current main tables:

- users
- categories
- tasks

Use:
- Primary keys
- Foreign keys
- Appropriate constraints

Users must only be able to access their own tasks.

Do not modify the database schema unless required by the feature.

When changing the schema:
1. Update database/schema.sql.
2. Update docs/database.md.
3. Explain the migration/change.

---

## 9. Security Rules

- Never commit .env files.
- Never expose database credentials.
- Never store plaintext passwords.
- Passwords must be hashed.
- Validate user input.
- Users must only access their own data.
- Never expose secrets in frontend code.

---

## 10. Testing

After implementing a feature:

1. Run relevant tests.
2. Run the application if necessary.
3. Check for errors.
4. Verify the changed functionality.
5. Report what was tested.

Do not claim that something works without checking it.

---

## 11. Git Rules

Use meaningful commits.

Commit prefixes:

feat:
fix:
refactor:
docs:
style:
test:
chore:

Examples:

feat: add task CRUD API
fix: validate task datetime
docs: update database design
refactor: separate task controller

Avoid meaningless commit messages:

update
fix
test
abc
final
final2

After completing a meaningful feature:

1. Check git status.
2. Review changed files.
3. Run relevant tests.
4. Commit the changes.
5. Verify the commit.

Do not modify or amend previous commits unless explicitly requested.

---

## 12. Working Style

For a non-trivial feature:

1. Understand the request.
2. Inspect relevant existing code.
3. Identify affected files.
4. Make a short implementation plan.
5. Implement incrementally.
6. Test the implementation.
7. Summarize changed files and test results.

Do not make large unrelated changes.

---

## 13. Product Documentation

Use these documents when relevant:

Product:
docs/product.md

Requirements:
docs/requirements.md

Architecture:
docs/architecture.md

Database:
docs/database.md

Architecture decisions:
docs/decisions.md

Read only the documents relevant to the current task.
Do not unnecessarily load every document for a small change.