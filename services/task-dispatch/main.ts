import { consul, httpRest } from "cmon-lib";
import * as mysql from "mysql";
import * as redis from "redis";

// const client = redis.createClient();
// client.on("error", (err) => console.log("Error " + err));

// client.lpush("b", "Aaa");

// const httpRoute = new httpRest.RouteService();

// httpRoute.get<{ host: string }>("/v1/os/host/:host/tasks", (ctx) => {
//     ctx.res.end("a");
// });

// httpRoute.post<{ host: string, task: string }>("/v1/host/:host/task/:task", (ctx) => {
//     ctx.res.statusCode = 200;
//     ctx.res.end();
// });

// httpRest.createHttpRestServer(...httpRoute.routes).listen(9000);
async function main() {
    const mysqlServices = await consul.getServiceByName("mysql");
    if (mysqlServices.length === 0) { throw new Error("service mysql no exist."); }
    const mysqlService = mysqlServices[0];
    const connection = mysql.createPool({
        database: "cmon",
        host: mysqlService.ServiceAddress,
        password: "123456aA+",
        user: "root",
    });
    console.info("connect start.");
    connection.on("error", (err) => console.info(err));

    setInterval(async () => {
        connection.getConnection((err, conn) => {
            if (err) {
                console.info("conn fff");
            } else {
                conn.query("SELECT 1 + 1 AS solution", (error, results, fields) => {
                    conn.release();
                    if (error) { console.info(error); } else {
                        console.info(results[0], new Date());
                    }
                });
            }
        });
    }, 1000);
}

main().catch((err) => console.error(err));
