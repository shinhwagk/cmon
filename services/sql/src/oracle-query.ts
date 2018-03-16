import * as oracledb from "oracledb";

export function executeQuery(connect: oracledb.IConnectionAttributes, sql: string, args: any[]): Promise<any> {
    return new Promise(async (resolve, reject) => {
        let conn;
        try {
            conn = await oracledb.getConnection(connect);
            const result = await conn.execute(sql, args, { outFormat: oracledb.OBJECT });
            resolve(result.rows);
        } catch (err) { reject(err); } finally {
            if (conn) {
                try { await conn.release(); } catch (err) { console.error(err); reject(err); }
            }
        }
    });
}
