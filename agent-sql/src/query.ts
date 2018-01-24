import * as oracledb from "oracledb"
import * as http from "http"

interface query {
    (select: string, args: any[]): Promise<string>
}

interface sendresult {
    (result: string): void
}

interface IQueryAges {
    SQL: string
    ARGS: any[]
}

// function qtos(iqa: IQueryAges, query: query, sendresult: sendresult) {
//     const result = query(iqa.SQL, iqa.ARGS);
//     sendresult(result)
// }

interface QueryRest {
    url: string
}

async function query111() {
    return "a"
}


export function queryFunc(sql: string, args: any[]): Promise<string> {
    return new Promise(async (resolve, reject) => {
        let conn;

        try {
            conn = await oracledb.getConnection({
                user: "system",
                password: "oracle",
                connectString: "10.65.193.29/orcl"
            });

            let result = await conn.execute(sql, args, { outFormat: oracledb.OBJECT });
            resolve(JSON.stringify(result.rows));

        } catch (err) {
            reject(err);
        } finally {
            if (conn) {
                try {
                    await conn.release();
                } catch (e) {
                    console.error(e);
                }
            }
        }
    });
}

// getEmployee("WMSYS").then(rows => console.info(rows))