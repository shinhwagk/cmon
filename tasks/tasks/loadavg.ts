import { command as cd, endpoint as ep, steps } from "cmon-task-lib";

import { getEndpoint } from "../../api/client";

type Metric = ICpuStat;

export interface ICpuStat {
  min1: number;
  min5: number;
  min15: number;
}

function makeTags(p: ep.IOSEndpoint, d: Metric) {
  return { Ip: p.ip, name: p.name };
}

function makeValues(p: ep.IOSEndpoint, d: Metric) {
  return { min1: d.min1, min5: d.min5, min15: d.min15 };
}

const cs = steps.CronStep<ep.IOSEndpoint, Metric>("cron", 60 * 1000,
  getEndpoint<ep.IOSEndpoint>("os", "loadavg"), cd.scriptServiceClient<ep.IOSEndpoint, Metric>("loadavg"), false);
const print = steps.PrintStep("print", (p: ep.IOSEndpoint, d: Metric) =>
  console.info(p, (new Date()).getMilliseconds(), d));
const influx = steps.InfluxStep<ep.IOSEndpoint, Metric>("influx", "mydb", "loadavg", makeTags, makeValues);

const g: Step[][] = [
  [cs, influx, print]
]

RunTasks(g)