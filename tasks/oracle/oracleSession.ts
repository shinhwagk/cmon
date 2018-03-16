import { command, steps, task } from "cmon-task-lib";

export interface IOracleEndPoint {
    name: string;
}

type OracleEndPoint = IOracleEndPoint;

type Metric = ISession;

export interface ISession {
    USERNAME: string;
    MACHINE: string;
    COUNT: number;
    STATUS: string;
}

export const OracleEndPoints: IOracleEndPoint[] = [
    { name: "yali2" },
    { name: "yali3" },
];

const sqlText = "SELECT username, machine, 1 count, status FROM v$session WHERE username is not null";

function makeTags(p: OracleEndPoint, d: Metric) {
    return { name: p.name, username: d.USERNAME, machine: d.MACHINE, count: d.COUNT, status: d.STATUS };
}
function makeValues(p: OracleEndPoint, d: Metric) {
    return { count: d.COUNT };
}

const cs = steps.CronStep<OracleEndPoint, Metric>("cron", 60000, OracleEndPoints,
    command.sqlServiceClient<OracleEndPoint, Metric>(sqlText, []));
const print = steps.PrintStep("print",
    (p: OracleEndPoint, d: Metric) => console.info(p, (new Date()).getMilliseconds(), d));
const influx = steps.InfluxStep<OracleEndPoint, Metric>("influx", "mydb", "orclsession", makeTags, makeValues);

const g = steps.Grap<OracleEndPoint, Metric, Metric>(cs, print, influx);

task.RunTasks([g]);
