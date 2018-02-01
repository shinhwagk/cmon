import { CreoStep, FilterStep, PrintStep, InfluxStep, execCommand, Step, sss } from "tasks";

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
  { ip: "127.0.0.1", name: "test" },
  { ip: "127.0.0.1", name: "test2" },
]

function makeTags(p: OSEndPoint, d: DiskSpace) {
  return { Ip: p.ip, Name: p.name, Filesystem: d.Filesystem, MountedOn: d.MountedOn }
}
function makeValues(p: OSEndPoint, d: DiskSpace) {
  return { Capacity: d.Capacity, Used: d.Used, Available: d.Available }
}

const cs: Step = CreoStep<DiskSpace, OSEndPoint>("cron", 15000, OSEndPoints, execCommand<DiskSpace, OSEndPoint>("disk"))
const filter: Step = FilterStep<OSEndPoint, DiskSpace>("filter", (ds: DiskSpace) => ds.Capacity >= 10)
const print: Step = PrintStep("print", (p: OSEndPoint, d: DiskSpace) => console.info(p, (new Date).getMilliseconds(), d))
const influx: Step = InfluxStep<OSEndPoint, DiskSpace>("influx", "disk2", makeTags, makeValues)

const g: Step[][] = [
  [cs, filter, influx],
  [filter, print]
]

sss(g)