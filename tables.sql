CREATE SCHEMA todolist;

CREATE TABLE todolist.users (
    id SERIAL PRIMARY KEY,
    login varchar(255) UNIQUE NOT NULL,
    password varchar(255) NOT NULL CHECK (password IS NOT NULL AND password != ''),
    email varchar(255) UNIQUE NOT NULL CHECK (email IS NOT NULL AND email != ''),
    confirmed boolean DEFAULT FALSE,
    user_link varchar(255) UNIQUE NOT NULL,
    phone varchar(64),
    roles integer[] DEFAULT '{2}'
);

CREATE TABLE todolist.tokens (
    user_id SERIAL PRIMARY KEY,
    refresh_token varchar(255)
);

CREATE TABLE todolist.roles (
    id SERIAL PRIMARY KEY,
    name varchar(255)
);

CREATE TABLE todolist.todos (
    id SERIAL PRIMARY KEY,
    user_id integer,
    title varchar(255) NOT NULL,
    description text,
    is_done boolean DEFAULT FALSE,
    deadline varchar(64) CHECK (deadline IS NULL OR deadline::timestamp > created_at),
    created_at timestamp DEFAULT now(),
    updated_at timestamp,
    FOREIGN KEY (user_id) REFERENCES todolist.users(id) ON DELETE CASCADE
);

CREATE TABLE todolist.tasks (
    id SERIAL PRIMARY KEY,
    todo_id integer,
    title varchar(255),
    description text,
    is_done boolean DEFAULT FALSE,
    FOREIGN KEY (todo_id) REFERENCES todolist.todos(id) ON DELETE CASCADE
);

INSERT INTO todolist.roles (name) VALUES ('admin'), ('user');
/* users pass: qwerty */
INSERT INTO todolist.users (login, password, email, phone) VALUES
('petr', '$2a$07$K6JFiylYvs5c4IeERLm/YOS/mP4S5wGiwdMpJ7bGp7TTASNfEkM0u', 'petr@mail.ru', '8-800-900-66-33'),
('oleg', '$2a$07$K6JFiylYvs5c4IeERLm/YOS/mP4S5wGiwdMpJ7bGp7TTASNfEkM0u', 'oleg@mail.ru', '8-800-800-00-21');

INSERT INTO todolist.todos (user_id, title, description, is_done, deadline) VALUES
(1, 'todo1', NULL, FALSE, NULL),
(1, 'todo2', NULL, FALSE, NULL),
(1, 'todo3', NULL, FALSE, NULL),
(1, 'todo4', NULL, FALSE, NULL),
(2, 'todo1', NULL, FALSE, NULL),
(2, 'todo2', NULL, FALSE, NULL),
(2, 'todo3', NULL, FALSE, NULL);

INSERT INTO todolist.tasks (todo_id, title, description, is_done) VALUES
(1, 'task1', NULL, FALSE),
(1, 'task2', NULL, FALSE),
(1, 'task3', NULL, FALSE),
(1, 'task4', NULL, FALSE),
(1, 'task5', NULL, FALSE),
(1, 'task6', NULL, FALSE),
(2, 'task1', NULL, FALSE),
(2, 'task2', NULL, FALSE),
(2, 'task3', NULL, FALSE),
(2, 'task4', NULL, FALSE);
