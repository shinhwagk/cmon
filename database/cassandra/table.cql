CREATE KEYSPACE Excelsior WITH replication = {'class': 'SimpleStrategy', 'replication_factor' : 1};

CREATE TABLE task_with_endpoint_history (
    uuid int,
    task_kind int,
    task_name text,
    endpoint_name text static,
    result text,
    error text,
    PRIMARY KEY (pk, t)
);