import { command, steps, task } from "cmon-task-lib";

export interface IOSEndPoint {
  name: string;
  ip: string;
}
type Metric = ICpuStat;

export interface ICpuStat {
  user: string;
  nice: number;
  system: number;
  idle: number;
  iowait: number;
  irq: number;
  steal: number;
  guest: number;
}

export const OSEndPoints: IOSEndPoint[] = [
  { ip: "10.65.193.51", name: "test" },
];

function makeTags(p: IOSEndPoint, d: Metric) {
  return { Ip: p.ip, Name: p.name };
}
function makeValues(p: IOSEndPoint, d: Metric) {
  return {
    guest: d.guest, idle: d.idle,
    iowait: d.iowait, irq: d.irq, nice: d.nice, steal: d.steal, system: d.steal, user: d.user,
  };
}

const cs =
  steps.CronStep<IOSEndPoint, Metric>("cron", 15000, OSEndPoints, command.scriptServiceClient("cpustat"), false);
const print =
  steps.PrintStep("print", (p: IOSEndPoint, d: Metric) => console.info(p, (new Date()).getMilliseconds(), d));
const influx = steps.InfluxStep<IOSEndPoint, Metric>("influx", "mydb", "cpustat", makeTags, makeValues);

const grap = steps.Grap(cs, print, influx);

task.RunTasks([grap]);
