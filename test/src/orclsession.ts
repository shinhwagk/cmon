import { CreoStep, FilterStep, PrintStep, InfluxStep, execSql, Step, RunTasks } from "tasks";

export interface OracleEndPoint {
    name: string;
    ip: string;
}

type Metric = CpuStat

export interface CpuStat {
    username: string;
}

export const OracleEndPoints: OracleEndPoint[] = [
    { ip: "10.65.193.52", name: "test2" }
]

const sqlText = "select * from v$session where username is not null"

function makeTags(p: OracleEndPoint, d: Metric) {
    return { Ip: p.ip, Name: p.name }
}
function makeValues(p: OracleEndPoint, d: Metric) {
    return { username: d.username, }
}

const cs: Step = CreoStep<Metric, OracleEndPoint>("cron", 15000, OracleEndPoints, execSql<Metric, OracleEndPoint>(sqlText, []))
const print: Step = PrintStep("print", (p: OracleEndPoint, d: Metric) => console.info(p, (new Date).getMilliseconds(), d))
const influx: Step = InfluxStep<OracleEndPoint, Metric>("influx", "orcl-session", makeTags, makeValues)

const g: Step[][] = [
    [cs, influx],
    [cs, print]
]

RunTasks(g)