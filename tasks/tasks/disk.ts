import { CreoStep, FilterStep, PrintStep, InfluxStep, execCommand, Step, RunTasks } from "tasks";

export interface OSEndPoint {
  name: string;
  ip: string;
}

export interface DiskSpace {
  Filesystem: string;
  Blocks: number;
  Used: number;
  Available: number;
  Capacity: number;
  MountedOn: number;
}

export const OSEndPoints: OSEndPoint[] = [
  { ip: "10.65.193.51", name: "test" }
]

function makeTags(p: OSEndPoint, d: DiskSpace) {
  return { Ip: p.ip, Name: p.name, Filesystem: d.Filesystem, MountedOn: d.MountedOn }
}
function makeValues(p: OSEndPoint, d: DiskSpace) {
  return { Capacity: d.Capacity, Used: d.Used, Available: d.Available }
}

const cs: Step = CreoStep<OSEndPoint, DiskSpace>("cron", 15000, OSEndPoints, execCommand<OSEndPoint, DiskSpace>("disk"))
const filter: Step = FilterStep<OSEndPoint, DiskSpace>("filter", (ds: DiskSpace) => ds.Capacity >= 1)
const print: Step = PrintStep("print", (p: OSEndPoint, d: DiskSpace) => console.info(p, (new Date).getMilliseconds(), d))
const influx: Step = InfluxStep<OSEndPoint, DiskSpace>("influx", "disk", makeTags, makeValues)

const g: Step[][] = [
  [cs, filter],
  [filter, influx],
  [cs, print]
]

RunTasks(g)