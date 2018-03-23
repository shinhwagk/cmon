CREATE DATABASE cmon;

use cmon;

CREATE TABLE endpoint_os (
    id int primary key,
    name varchar(20) not null
);

CREATE TABLE tasks_os (
    id int primary key,
    name varchar(30) not null,
    scripts json not null
);

DROP TABLE task_with_endpoint_os;
CREATE TABLE task_with_endpoint_os (
    id          int         primary key,
    task_id     int         not null,
    endpoint_id int         not null,
    args        json        not null,
    cron_second int         not null,
    cron_minute int         not null,
    cron_hour   int         not null,
    cron_day    varchar(20) not null,
    cron_month  varchar(20) not null,
    cron_year   varchar(20) not null,
    cron_week   varchar(20) not null,
    INDEX idx_task_id (task_id),
    INDEX idx_endpoint_id (endpoint_id)
);

CREATE TABLE tasks_file_state_os (
    id primary key,
);

CREATE TABLE tasks_oracle (
    id int primary key,
    name varchar(30) not null,
    scripts json not null
);

CREATE TABLE endpoint_oracle (
    id int primary key,
    name varchar(20) not null,
    ip varchar(20) not null,
    port int not null,
    user varchar(20) not null,
    password varchar(20) not null,
    service varchar(20) not null
);

CREATE table task_with_endpoint_oracle (
    task_id int not null,
    endpoint_id int not null,
    logic json not null
);
