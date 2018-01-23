import * as oracledb from "oracledb"
import * as http from "http"

interface query {
    (select: string, args: any[]): string
}

interface sendresult {
    (result: string): void
}

interface IQueryAges {
    SQL: string
    ARGS: any[]
}

function qtos(iqa: IQueryAges, query: query, sendresult: sendresult) {
    const result = query(iqa.SQL, iqa.ARGS);
    sendresult(result)
}

interface QueryRest {
    url: string
}


const server = http.createServer((req, res) => {
//   const ip = res.socket.remoteAddress;
//   const port = res.socket.remotePort;
  res.end(`Your IP address is 1 and your source port is 2.`);
}).listen(3000);