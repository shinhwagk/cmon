import { database, httpRest } from "cmon-task-lib";

import { mysqlConfig } from "../services-config";
import { ApiTaskEndpoint as ate } from "../services-config";

const routeService = new httpRest.RouteService();

routeService.get<{ kind: string, name: string }>(ate.url, (ctx) => {
    const kind = ctx.req.param.kind;
    const name = ctx.req.param.name;
    const sql = `SELECT * FROM task_endpoint where kind = '${kind}' and name = '${name}'`;
    database.futureQuery(mysqlConfig, sql).then((res) => ctx.res.end(JSON.stringify(res)));
});

httpRest.createHttpRestServer(...routeService.routes).listen(ate.port);
