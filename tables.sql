CREATE SCHEMA todolist;

CREATE TABLE todolist.users (
    id SERIAL PRIMARY KEY,
    login varchar(255) UNIQUE NOT NULL,
    password varchar(255) NOT NULL,
    email varchar(255) UNIQUE NOT NULL,
    phone varchar(64),
    roles integer[],
);

CREATE TABLE todolist.roles (
    id SERIAL PRIMARY KEY,
    name varchar(255)
);

CREATE TABLE todolist.todos (
    id SERIAL PRIMARY KEY,
    user_id integer,
    title varchar(255),
    description text,
    is_done boolean DEFAULT FALSE,
    deadline timestamp CHECK (deadline < created_at),
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

INSERT INTO todolist.users (login, password, email, phone, roles) VALUES 
('petr', 'qwerty123', 'petr@mail.ru', '8-800-900-66-33', '{2}'), 
('oleg', 'oleg123', 'oleg@mail.ru', '8-800-800-00-21', '{2}');

INSERT INTO todolist.todos (user_id, title, description, is_done, deadline) VALUES 
(1, 'todo1', NULL, FALSE, NULL), 
(1, 'todo2', NULL, FALSE, NULL);

INSERT INTO todolist.tasks (todo_id, title, description, is_done) VALUES 
(1, 'task1', NULL, FALSE), 
(1, 'task2', NULL, FALSE);
