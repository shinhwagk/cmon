import * as http from "http"
import * as url from "url"

import * as oracledb from "oracledb"

import { queryFunc } from "./query"
import { connects } from './connect'

interface IRequestListener {
  (request: http.IncomingMessage, response: http.ServerResponse): void
}

interface IQueryFunctionForRequestListener {
  (f: (conn: oracledb.IConnectionAttributes, sql: string, args: any[]) => Promise<any>): IRequestListener
}

const queryRequestListener: IQueryFunctionForRequestListener = (f) => (q, p) => {
  const b: Buffer[] = [];
  q.on('data', (chunk: Buffer) => b.push(chunk));
  q.on('end', () => {
    const dbname: string = <string>(<string>url.parse(<string>q.url).path).split("/").pop()
    const args = JSON.parse(b.toString())
    const conn = connects[dbname]
    f(conn, args[0], args[1]).then(result => {
      p.writeHead(200, { "Content-Type": "application/json" });
      p.write(JSON.stringify(result))
      p.end();
    }).catch(e => {
      p.writeHead(500); p.write(e); p.end();
    })
  });
}

function startService(port: number) {
  return http.createServer(queryRequestListener(queryFunc)).listen(port);
}


startService(8001)