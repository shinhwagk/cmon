CREATE DATABASE cmon;

CREATE TABLE cmon.endpoint_oracle (
    id int primary key,
    name varchar(20) not null,
    ip varchar(20) not null,
    port int not null,
    user varchar(20) not null,
    pass varchar(20) not null,
    service varchar(20) not null
);

CREATE TABLE endpoint_os (
    id int primary key,
    name varchar(20) not null,
);

CREATE TABLE tasks_os (
    id int primary key,
    name varchar(30) not null,
    scripts json not null
);

CREATE table task_with_endpoint_os (
    task_id int not null,
    endpoint_id int not null,
    logic json not null
);

CREATE table task_with_endpoint_oracle (
    task_id int not null,
    endpoint_id int not null,
    logic json not null
);
