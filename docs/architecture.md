# TaskFlow Architecture

## System

React Frontend
        |
        | REST API
        ↓
Node.js + Express
        |
        | SQL
        ↓
MySQL

## Frontend

frontend/src/

components/
pages/
services/
hooks/
context/

## Backend

backend/src/

routes/
controllers/
middleware/
config/

## Database

database/schema.sql

Main entities:

User
Task
Category