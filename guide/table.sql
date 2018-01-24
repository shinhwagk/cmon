CREATE TABLE subscribe {

}

CREATE TABLE service_command {

}

CREATE TABLE endpoint_os {
  id int primary key,

}

CREATE TABLE runtime_endpoint_os {
  version
}

CREATE TABLE endpoint_oracle {
  id int primary key,
  name varchar2(255),
  ORACLE_HOME varchar2(255),
  ORACLE_SID varchar2(255),
  os int
}

CREATE TABLE runtime_endpoint_oracle {

}

CREATE TABLE endpoint_oracle_rac {
  id int primary key,
  name varchar2(255),
  node varchar2()
}