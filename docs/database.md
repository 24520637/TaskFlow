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

The users, categories, and tasks tables are defined in `database/schema.sql`.

### categories

Stores task categories.

Fields:

- id
- user_id
- name
- color
- created_at

`user_id` ensures categories belong to their owner.

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

`user_id` ensures tasks belong to their owner. `category_id` is nullable and may only
reference a category owned by the same user at the service layer.

## Relationships

User 1:N Task

User 1:N Category

Category 1:N Task