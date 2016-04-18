CREATE TABLE time_entry (
    id integer SERIAL,
    employee integer NOT NULL REFERENCES employees (id),
    creator integer NOT NULL REFERENCES employees (id),
    minutes integer,
    project integer NOT NULL, -- FIXME: foreign key
    customer character(3) NOT NULL,
    comment text,
    date date NOT NULL,
    created timestamp without time zone DEFAULT now(),
);

-- returns the total number of minutes worked per day from the given start date for `days` days
drop function if exists entries_sums_for_employee(integer, date, integer);
create or replace function entries_sums_for_employee(employee_id integer, start_date date default date_trunc('week', current_date), days integer default 7)
returns table (
    date date,
    sum integer)
as $$
    select date, sum(minutes)::integer from time_entry
    where employee = employee_id
      and date >= start_date
      and date < start_date + days
    group by date;
$$
language sql stable;

-- returns the projects together with logged minutes for a given employee at a
-- given date, plus projects with logged time within two weeks before the given
-- date
drop function if exists projects_for_employee_for_date(integer, date);
create or replace function projects_for_employee_for_date(employee_id integer, date date default current_date)
returns TABLE (
    project_code text,
    code integer,
    customer character,
    title text,
    minutes integer)
as $$
select project_row.project || project_row.customer,
       project_row.project,
       project_row.customer,
       project_row.title,
       coalesce(sum(e.minutes), 0)::integer
from (
    select distinct t.project, t.customer, p.title
    from time_entry as t,
         projects as p
    where date <= $2
      and date > $2 - '2 weeks'::interval
      and employee = employee_id
      and t.customer = p.customer
      and t.project = p.code
    ) as project_row
left join time_entry e
    on e.date = $2
   and e.employee = employee_id
   and e.project = project_row.project
   and e.customer = project_row.customer
group by project_row.project,
         project_row.customer,
         project_row.title;
$$
language sql immutable strict;
