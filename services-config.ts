import { ConnectionConfig } from "mysql";

export const ApiTaskEndpoint = {
    host: "database.cmon.org",
    makeUrl: (kind: string, name: string) => `/v1/endpoint/${kind}/task/${name}"`,
    port: 9510,
    url: "/v1/endpoint/:kind/task/:name",
};

export const mysqlConfig: ConnectionConfig = {
    database: "cmon",
    host: "database.cmon.org",
    password: "123456aA+",
    user: "root",
};

export const redisConfig = {
    host: "redis.cmon.org",
};

export const dispatchMiddle = {
    host: "dispatch.middle.cmon.org",
    port: 9510,
    url: "/v1/endpoint/:kind/task/:name",
};
