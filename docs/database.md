# TaskFlow Database

## Database

MySQL

## Tables

### users

Stores user account information.

Fields:

- id
- name
- email
- password_hash
- created_at
- updated_at

`password_hash` stores a bcrypt hash only. Plaintext passwords must never be stored.

The initial users table is defined in `database/schema.sql`. Categories and tasks will
be added when their APIs are implemented.

### categories

Stores task categories.

Fields:

- id
- user_id
- name
- color
- created_at

### tasks

Stores user tasks.

Fields:

- id
- user_id
- category_id
- title
- description
- start_datetime
- end_datetime
- deadline
- priority
- status
- created_at
- updated_at

## Relationships

User 1:N Task

User 1:N Category

Category 1:N Task