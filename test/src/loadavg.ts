import { CreoStep, FilterStep, PrintStep, InfluxStep, execCommand, Step, sss } from "tasks";

export interface OSEndPoint {
  name: string;
  ip: string;
}

type Metric = CpuStat

export interface CpuStat {
  min1: number;
  min5: number;
  min15: number;
}

export const OSEndPoints: OSEndPoint[] = [
  { ip: "127.0.0.1", name: "test" },
  // { ip: "127.0.0.1", name: "test2" },
]

function makeTags(p: OSEndPoint, d: Metric) {
  return { Ip: p.ip, Name: p.name }
}
function makeValues(p: OSEndPoint, d: Metric) {
  return { min1: d.min1, min5: d.min5, min15: d.min15 }
}

const cs: Step = CreoStep<Metric, OSEndPoint>("cron", 60 * 1000, OSEndPoints, execCommand<Metric, OSEndPoint>("loadavg"))
const print: Step = PrintStep("print", (p: OSEndPoint, d: Metric) => console.info(p, (new Date).getMilliseconds(), d))
const influx: Step = InfluxStep<OSEndPoint, Metric>("influx", "loadavg", makeTags, makeValues)

const g: Step[][] = [
  [cs, influx],
  [cs, print]
]

sss(g)