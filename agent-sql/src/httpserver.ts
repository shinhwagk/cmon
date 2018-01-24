import * as http from "http"

import { queryFunc } from "./query"

interface IRequestListener {
  (request: http.IncomingMessage, response: http.ServerResponse): void
}

interface IQueryFunctionForRequestListener {
  (f: (sql: string, args: any[]) => Promise<string>): IRequestListener
}

const queryRequestListener: IQueryFunctionForRequestListener = (f) => (q, p) => {
  const b: Buffer[] = [];
  q.on('data', (chunk: Buffer) => b.push(chunk));
  q.on('end', () => f(JSON.parse(b.toString())[0], JSON.parse(b.toString())[1]).then(result => {
    p.writeHead(200, { "Content-Type": "application/json" });
    p.write(result)
    p.end();
  }));
}

function startService(port: number) {
  return http.createServer(queryRequestListener(queryFunc)).listen(port);
}


startService(3000)