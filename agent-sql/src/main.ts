import * as http from "http"
import * as url from "url"
import * as fs from "fs"

import * as oracledb from "oracledb"

import { queryFunc } from "./query"
// import { connects } from './connect'

type OIC = oracledb.IConnectionAttributes

interface IRequestListener {
  (request: http.IncomingMessage, response: http.ServerResponse): void
}

interface IQueryFunctionForRequestListener {
  (f: (conn: OIC, sql: string, args: any[]) => Promise<any>): IRequestListener
}

const queryRequestListener: IQueryFunctionForRequestListener = (f) => (q, p) => {
  const b: Buffer[] = [];
  q.on('data', (chunk: Buffer) => b.push(chunk));
  q.on('end', () => {
    const dbname: string = <string>(<string>url.parse(<string>q.url).path).split("/").pop()
    const args = JSON.parse(b.toString())
    const conn: oracledb.IConnectionAttributes = servers()[dbname]
    f(conn, args[0], args[1]).then(result => {
      p.writeHead(200, { "Content-Type": "application/json" });
      p.write(JSON.stringify(result))
      p.end();
    }).catch(e => {
      p.writeHead(500); p.write(e); p.end();
    })
  });
}

type Servers = { [name: string]: oracledb.IConnectionAttributes }
function servers() {
  const fileContent = fs.readFileSync("servers.json", "utf-8")
  return <Servers>JSON.parse(fileContent)
}

function startService(port: number) {
  return http.createServer(queryRequestListener(queryFunc)).listen(port);
}

startService(9500)