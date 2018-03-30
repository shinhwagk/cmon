CREATE DATABASE pmon;

USE pmon;

DROP TABLE task_script;
CREATE TABLE task_script (
    id          int         primary key auto_increment,
    category    varchar(30) not null,
    name        varchar(30) not null,
    main        varchar(30) not null,
    scripts     json        not null
);

DROP TABLE task_with_endpoint_os;
CREATE TABLE task_with_endpoint_os (
    task_id     int         not null,
    endpoint_id int         not null,
    args        json        not null,
    cron_expr   varchar(20) not null,
    INDEX idx_task_id (task_id),
    INDEX idx_endpoint_id (endpoint_id)
);

DROP TABLE task_with_endpoint_oracle;
CREATE TABLE task_with_endpoint_oracle (
    task_id     int     not null,
    endpoint_id int     not null,
    args        json    not null
);

-- DROP TABLE task_graph;
-- CREATE TABLE task_graph (
--     id int primary key auto_increment,
--     pmon_name varchar(30) not null
-- );

-- CREATE TABLE task_graph (
--     f_task_id int not null,
--     c_task_id int not null,
-- );

-- DROP TABLE task_with_endpoint_state
-- CREATE TABLE task_with_endpoint_state (
--     id int primary key auto_increment,
--     task_kind varchar(10) not null -- os or oracle
--     result text,
--     error text,
--     last_time DATETIME not null
-- );