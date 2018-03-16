import { database, httpRest } from "cmon-task-lib";
import * as oracledb from "oracledb";

import { IOracleEndPoint } from "../../../endpoint/oracleEndpoint";
import { executeQuery } from "./oracle-query";

const routeService = new httpRest.RouteService();

const connConfig = { host: "10.65.193.52", user: "root", password: "123456aA+", database: "cmon" };

routeService.post<{ name: string }>("/v1/sql/oracle/:name", (ctx) => {
  const connName = ctx.req.param.name;
  const body = ctx.req.body;
  const args = JSON.parse(body.toString()) as any[];
  getConnectionAttributesByName(connName).then((conn) => {
    executeQuery(conn, args[0], []).then((result: any) => {
      ctx.res.end(JSON.stringify(result));
    });
  });
});

function getConnectionAttributesByName(dbName: string) {
  return new Promise<oracledb.IConnectionAttributes>((r, x) => {
    database.query<IOracleEndPoint>(connConfig,
      `select name, ip, port, user, pass, service from cmon.endpoint where name='${dbName}'`, (results) => {
        if (results) {
          const conn = results[0];
          r({ user: conn.user, connectString: `${conn.ip}：${conn.port}/${conn.service}`, password: conn.password });
        } else {
          console.error(`oracle conn name: ${dbName} no exist.`);
        }
      });
  });
}

httpRest.createHttpRestServer(...routeService.routes).listen(8000);
