import * as event from "events";
import * as http from "http";

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
  start(): void;
  ename: string[];
  name: string;
  subEvent(name: string): void;
  steps: IStep[]
  sub(...s: IStep[]): void

  pushSteps(step: IStep): void
}


export interface ICronStep extends IStep {

  cron(name: string, cron: string, func: (name: string) => string): void
}

class FilterStep<T> implements IStep {
  pushSteps(step: IStep): void {
    this.steps.push(step)
  }
  name: string = "filter";
  event: event.EventEmitter
  ename: string[] = [];
  steps: IStep[] = []
  f: (a: T) => boolean;
  start(): void {
    console.info("filter listener start ")
    this.event.on(this.name, this.action(this.f))
    this.steps.forEach(s => s.start())
  }

  sub(...s: IStep[]) {
    s.map(s => s.name).forEach(n => this.subEvent(n))
    s.forEach(n => n.pushSteps(this))
  }

  action(f: (a: T) => boolean): (point: OSEndPoint, elem: T) => void {
    return (point: OSEndPoint, upval: T) => {
      if (f(upval)) {
        console.info("send data to print ", upval)
        this.ename.forEach(name => this.event.emit(name, point, upval))
      }
    }
  }

  subEvent(name: string): void {
    this.ename.push(name)
  }

  constructor(event: event.EventEmitter, f: (a: T) => boolean) {
    console.info("filter construc")
    this.event = event
    this.f = f
  }
}

class CronStep<M, P> implements IStep {
  steps: IStep[];

  points: P[];
  name: string = "cron";
  event: event.EventEmitter;
  f: (point: P) => Promise<M[]>
  s: number
  ename: string[] = [];

  subEvent(name: string) {
    this.ename.push(name)
  }

  pushSteps(step: IStep): void {
    this.steps.push(step)
  }

  constructor(points: P[], event: event.EventEmitter, s: number, f: (point: P) => Promise<M[]>) {
    console.info("cron construc")
    this.event = event
    this.f = f
    this.points = points
    this.s = s
  }

  // down
  sub(...s: IStep[]) {
    s.forEach(n => {
      this.subEvent(n.name)
      n.pushSteps(this)
    })
  }

  start(): void {
    console.info("cron listener start ")
    this.disp()
  }

  send(point: P, x: M): void {
    this.ename.forEach(name => this.event.emit(name, point, x))
  }

  disp() {
    setInterval(() => {
      this.points.forEach(p => { this.f(p).then(r => { r.forEach(x => this.send(p, x)) }) })
    }, this.s)
  }

}

class PrintStep<T> implements IStep {
  steps: IStep[] = [];
  ename: string[] = [];
  name: string = "print";
  event: event.EventEmitter;
  f: (p: OSEndPoint, a: T) => void
  pushSteps(step: IStep): void {
    this.steps.push(step)
  }
  sub(...s: IStep[]) {

  }

  start(): void {
    // console.info("print listener start ")
    this.event.on(this.name, this.f)
    this.steps.forEach(s => {
      console.info(`${s.name} listener start `)
      s.start()
    })
  }

  subEvent(name: string): void {
    throw new Error("Method not implemented.");
  }

  constructor(event: event.EventEmitter, f: (p: OSEndPoint, a: T) => void) {
    console.info("print construc")
    this.event = event
    this.f = f
  }
}

class InfluxStep<T, U> implements IStep {
  name: string
  tags: string[] = []
  values: string[] = []
  constructor(name: string, tags: string[], values: string[]) {
    this.name = name
    this.tags = tags
    this.values = values
  }

  start(): void {
    throw new Error("Method not implemented.");
  }
  ename: string[];

  subEvent(name: string): void {
    throw new Error("Method not implemented.");
  }
  steps: IStep[];
  sub(...s: IStep[]): void {
    throw new Error("Method not implemented.");
  }
  pushSteps(step: IStep): void {
    throw new Error("Method not implemented.");
  }

}

const e = new event.EventEmitter();
// function execCommand<T, U extends { ip: string }> 

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

interface Item<T, U> {
  point: T
  metric: U
}

const cs: IStep = new CronStep<DiskSpace, OSEndPoint>(OSEndPoints, e, 1000, execCommand);
const filter: IStep = new FilterStep<DiskSpace>(e, (ds) => ds.Capacity >= 10);
const print: IStep = new PrintStep<DiskSpace>(e, (p, d) => console.info(p, (new Date).getMilliseconds(), d.Capacity));
const influx: IStep = new InfluxStep<DiskSpace, OSEndPoint>("disk", [], [])

cs.sub(filter, influx)
filter.sub(print)
print.start()
influx.start()

// class GGG {
//   ss: IStep[] = []
//   sub(s: IStep, ...as: IStep[]) {

//   }
//   start() {

//   }
// }

// const ggg = new GGG()
// ggg.sub(cs, filter)
//     ggg.sub(filter, print)

// e.on("a",()=>console.info("xxx"))

// e.emit("a")

// getDiskSpace().then(console.info)

// interface IFilterStep<T> {
//   (result: T[], filterFunc: (r: T[]) => T[]): T[]

// }

// function filterStep<T>(result: T[], filterFunc: (r: T[]) => T[]) {
//   return filterFunc(result)
// }

// const task = new Task()
// task.source("collect disk", ).to(filterStep)