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
- password
- created_at
- updated_at

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