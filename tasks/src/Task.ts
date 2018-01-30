import * as event from "events";
import * as http from "http";

import * as Influx from "influx";

import { DiskSpace } from './metric/DiskSpace';
import { OSEndPoints, OSEndPoint } from "./EndPoint"
import { setInterval } from "timers";
import { inflate } from "zlib";

// import { IStep } from "./step"

// interface ITask {
//   source<T>(name: string, step: IStep<T>): ITask
//   to(): void
// }

// class Task implements ITask {
//   private event: event.EventEmitter = new event.EventEmitter();

//   private stepSet = new Map<string, IStep<any>>()

//   source<T>(name: string, step: IStep<T>): ITask {
//     this.stepSet.set(name, step)
//     return this
//   }

//   to<T>(f: IFilterStep<T>) {

//   }
// }
export interface IStep {
  listener?: (emit: (point: any, data: any) => void) => (...args: any[]) => void;
  localProcess?: (emit: any) => void;
  // process: (downStreamName: any, point: any, data: any) => void
  name: string;
}


// export interface ICronStep extends IStep {

//   cron(name: string, cron: string, func: (name: string) => string): void
// }


abstract class AbstractStep implements IStep {
  // downStream: IStep[] = [];
  name: string;
  // registerDownStream = (is: IStep) => this.downStream.push(is)
  process: (downStreamName: any, point: any, data: any) => void;

  // localProcess:()=void
  constructor(name: string) {
    this.name = name;
    console.info(`step ${this.name} start.`);
  }
}

class FilterStep<T> extends AbstractStep {
  process: (emt: any, point: any, data: any) => void
  listener = (emit: any) => (point: any, elem: any) => {
    if (this.func(elem)) { emit(point, elem) }
  }
  func: (elem: T) => boolean

  constructor(name: string, filterFunc: (elem: T) => boolean) {
    super(name)
    this.func = filterFunc
  }
}

class CronStep<P, M> extends AbstractStep {
  s: number;
  points: P[];
  execCommand: (point: P) => Promise<M[]>

  localProcess = (emit: (p: any, d: any) => void) => {
    setInterval(() => {
      const date = (new Date).getTime()
      this.points.forEach(p => {
        this.execCommand(p).then(r => r.forEach(x => emit(p, x)))
      })
    }, this.s)
  };

  constructor(name: string, i: number, points: P[], execCommand: (point: P) => Promise<M[]>) {
    super(name)
    this.s = i
    this.points = points
    this.execCommand = execCommand
  }
}

class PrintStep<T> extends AbstractStep {
  process: (emt: any, point: any, data: any) => void
  listener = (emit: any) => (point: any, elem: any) => {
    this.process(emit, point, elem)
  }
  constructor(name: string, PrintFunc: (...elems: any[]) => void) {
    super(name)
    this.process = (emt: any, point: any, data: any) => { PrintFunc(point, data) }
  }
}

class InfluxStep<T, U> extends AbstractStep {
  influx = new Influx.InfluxDB({
    host: '10.65.193.51',
    database: 'mydb'
  })
  tags: string[] = []
  values: string[] = []
  constructor(name: string, tags: string[], values: string[]) {
    super(name)
    this.name = name
    this.tags = tags
    this.values = values
  }


  listener = (emit: any) => (point: OSEndPoint, elem: any) => {
    this.influx.writePoints([
      {
        measurement: "disk",
        tags: { host: point.ip },
        fields: { cpu: 111, mem: 2222 },
        timestamp: 1434055562000000000
      }
    ])
  }
}

const execCommand = <M, U extends OSEndPoint>(point: U) => {
  return new Promise<M>((r, x) => {
    http.get(`http://${point.ip}:8000/command`, (res) => {
      const data: Buffer[] = []
      res.on("data", (chunk: Buffer) => { data.push(chunk) })
      res.on('end', () => {
        try {
          r(<M>JSON.parse(data.toString()))
        } catch (e) {
          console.error(`${e},${data.toString()}`)
        }
      })
    })
  })

}

const cs: IStep = new CronStep<OSEndPoint, DiskSpace>("cron", 15000, OSEndPoints, execCommand);
const filter: IStep = new FilterStep<DiskSpace>("filter", (ds) => ds.Capacity >= 10);
const print: IStep = new PrintStep<DiskSpace>("print", (p, d) => console.info(p, (new Date).getMilliseconds(), d));
const influx: IStep = new InfluxStep<DiskSpace, OSEndPoint>("disk", [], [])

class Start {
  private e = new event.EventEmitter();
  iss: IStep[] = [];
  isds: { [name: string]: string[] } = {};

  public sub(is: IStep, ...ds: IStep[]) {
    ds.forEach(s => this.registerDownStream(is.name, s.name))
    ds.unshift(is)
    ds.forEach(s => this.addStepIfNoExist(s))
  }

  private registerDownStream(name: string, dname: string) {
    if (!this.isds[name]) {
      this.isds[name] = []
    }
    this.isds[name].push(dname)
  }

  private addStepIfNoExist(is: IStep) {
    if (this.iss.indexOf(is) <= -1) {
      this.iss.push(is)
    }
  }

  private startListener() {
    for (const step of this.iss.reverse()) {
      const dNames: string[] = this.isds[step.name]
      const emit = (point: any, data: any) => dNames.forEach(dname => {
        console.info(`send to ${dname}, point:${point["name"]}.`)
        this.e.emit(dname, point, data)
      })

      if (step.listener) {
        console.info(`start listen ${step.name}.`)
        this.e.on(step.name, step.listener(emit))
      }

      if (step.localProcess) {
        console.info(`start localProcess ${step.name}.`)
        step.localProcess(emit)
      }
    }
  }

  private startStepExecute() {
    // for (const [name, step] of Array.from(this.iss).reverse()) {
    // }
  }

  end() {
    this.startListener()
    // this.startStepExecute()
  }
}

function sss(g:[])

const start = new Start()
start.sub(cs, filter, influx)
start.sub(filter, print)
start.end()





const filter1 =  