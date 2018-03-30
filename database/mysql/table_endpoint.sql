CREATE TABLE endpoint_oracle (
    id int primary key auto_increment,
    name varchar(20) not null,
    ip varchar(20) not null,
    port int not null,
    user varchar(20) not null,
    password varchar(20) not null,
    service varchar(20) not null
);

CREATE TABLE endpoint_mysql (
    id int primary key auto_increment,
    name varchar(20) not null,
    ip varchar(20) not null,
    port int not null,
    user varchar(20) not null,
    password varchar(20) not null,
    database varchar(20) not null
);

CREATE TABLE endpoint_os (
    id int primary key auto_increment,
    name varchar(20) not null
);