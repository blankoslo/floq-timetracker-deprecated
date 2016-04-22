BEGIN;
DROP TABLE IF EXISTS customers CASCADE;
DROP TABLE IF EXISTS projects CASCADE;
DROP TABLE IF EXISTS time_entry CASCADE;

CREATE TABLE customers (
id SERIAL PRIMARY KEY,
name TEXT NOT NULL
);

CREATE TABLE projects (
id SERIAL PRIMARY KEY,
name TEXT NOT NULL,
billable BOOLEAN,
customer INTEGER NOT NULL REFERENCES customers(id)
);

CREATE TABLE time_entry (
    id SERIAL PRIMARY KEY,
    employee INTEGER NOT NULL REFERENCES employees(id),
    creator INTEGER NOT NULL REFERENCES employees(id),
    minutes INTEGER,
    project INTEGER NOT NULL REFERENCES projects(id),
    date DATE NOT NULL,
    created TIMESTAMP WITHOUT TIME ZONE DEFAULT now()
);

CREATE INDEX time_entry_date_index ON time_entry (date);

COMMIT;
