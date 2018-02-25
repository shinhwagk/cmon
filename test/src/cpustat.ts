import { CreoStep, FilterStep, PrintStep, InfluxStep, execCommand, Step, RunTasks } from "tasks";

export interface OSEndPoint {
  name: string;
  ip: string;
}
type Metric = CpuStat

export interface CpuStat {
  user: string;
  nice: number;
  system: number;
  idle: number;
  iowait: number;
  irq: number;
  steal: number;
  guest: number;
}

export const OSEndPoints: OSEndPoint[] = [
  { ip: "10.65.193.52", name: "test2" }
]

function makeTags(p: OSEndPoint, d: Metric) {
  return { Ip: p.ip, Name: p.name }
}
function makeValues(p: OSEndPoint, d: Metric) {
  return { user: d.user, nice: d.nice, system: d.steal, idle: d.idle, iowait: d.iowait, irq: d.irq, steal: d.steal, guest: d.guest }
}

const cs: Step = CreoStep<Metric, OSEndPoint>("cron", 15000, OSEndPoints, execCommand<Metric, OSEndPoint>("cpustat"))
const print: Step = PrintStep("print", (p: OSEndPoint, d: Metric) => console.info(p, (new Date).getMilliseconds(), d))
const influx: Step = InfluxStep<OSEndPoint, Metric>("influx", "cpustat", makeTags, makeValues)

const g: Step[][] = [
  [cs, influx],
  [cs, print]
]

RunTasks(g)