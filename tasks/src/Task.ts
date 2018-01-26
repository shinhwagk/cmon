import * as event from "events";
import * as http from "http";

import { DiskSpace } from './metric/DiskSpace';
import { setInterval } from "timers";

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

  action(f: (a: T) => boolean): (elem: T) => void {
    return (upval: T) => {
      if (f(upval)) {
        console.info("send data to print ", upval)
        this.ename.forEach(name => this.event.emit(name, upval))
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

class CronStep<T> implements IStep {
  steps: IStep[];

  name: string = "cron";
  event: event.EventEmitter;
  f: () => Promise<T[]>
  s: number
  ename: string[] = [];

  subEvent(name: string) {
    this.ename.push(name)
  }
  pushSteps(step: IStep): void {
    this.steps.push(step)
  }
  constructor(event: event.EventEmitter, s: number, f: () => Promise<T[]>) {
    console.info("cron construc")
    this.event = event
    this.f = f
    this.s = s
  }

  // down
  sub(...s: IStep[]) {
    s.map(s => s.name).forEach(n => this.subEvent(n))
    s.forEach(n => n.pushSteps(this))
  }

  start(): void {
    console.info("cron listener start ")
    // s.forEach(x => x.start())
    this.disp()
  }

  send(x: T): void {
    this.ename.forEach(name => this.event.emit(name, x))
  }

  disp() {
    // console.info("send data to filter",<any>{"Capacity": 100})
    // this.event.emit("filter",<any>{"Capacity":111})
    setInterval(() => { this.f().then(r => { r.forEach(x => this.send(x)) }) }, this.s)
    // this.ename.forEach(name => this.event.emit(name, <any>{"Filesystem":"xxxxx"}))
    // this.ename.forEach(name => this.event.emit(name, <any>{"Filesystem":"xxxxx"}))
    // setInterval(()=>this.send(<any>{"Filesystem":"xxxxx"}),1000)
  }

}

class PrintStep<T> implements IStep {
  steps: IStep[] = [];
  ename: string[] = [];
  name: string = "print";
  event: event.EventEmitter;
  f: (a: T) => void
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

  constructor(event: event.EventEmitter, f: (a: T) => void) {
    console.info("print construc")
    this.event = event
    this.f = f
  }
}

const e = new event.EventEmitter();

function getDiskSpace(): Promise<DiskSpace[]> {
  return new Promise((r, x) => {
    http.get("http://127.0.0.1:8000/command", (res) => {
      const data: Buffer[] = []
      res.on("data", (chunk: Buffer) => { data.push(chunk) })
      res.on('end', () => {
        try {
          r(<DiskSpace[]>JSON.parse(data.toString()))
        } catch (e) {
          console.error(`${e},${data.toString()}`)
        }
      })
    })
  })
}

const cs: IStep = new CronStep<DiskSpace>(e, 1000, getDiskSpace);
const filter: IStep = new FilterStep<DiskSpace>(e, (ds) => ds.Capacity >= 10);
const print: IStep = new PrintStep<DiskSpace>(e, (d) => console.info((new Date).getMilliseconds(), d.Capacity))

cs.sub(filter)
filter.sub(print)
print.start()

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
