import * as event from "events"

import { DistSpace } from './metric/DiskSpace'

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
  start(...s: IStep[]): void;
  ename: string[];
  name: string;
  addEvent(name: string): void;
}




export interface ICronStep extends IStep {

  cron(name: string, cron: string, func: (name: string) => string): void
}

class filterStep<T> implements IStep {
  name: string;
  event: event.EventEmitter
  start(...s: IStep[]): void {
    s[0].start(this)

  }

  sub(...s: IStep[]) {
    s.map(s => s.name).forEach(this.addEvent)



  }

  action(f: (a: T) => boolean): (elem: T) => void {
    return (upval: T) => {
      const r = f(upval)
      this.ename.forEach(name => this.event.emit(name, r))
    }
  }
  ename: string[];
  addEvent(name: string): void {
    throw new Error("Method not implemented.");
  }

  constructor(event: event.EventEmitter, f: (a: T) => boolean) {
    this.event = event
    this.event.on(this.name, this.action(f))
  }
}

class CronStep implements ICronStep {
  name: string;
  public addEvent(name: string) {
    this.ename.push(name)
  }
  constructor(event: event.EventEmitter) {

  }

  ename: string[] = [];

  sub(...s: IStep[]) {
    s.map(s => s.name).forEach(this.addEvent)
  }

  start(...s: IStep[]): void {
    s.forEach(x => x.start())
  }

  cron(name: string, cron: string, func: (name: string) => string): void {

  }

}

class PrintStep<T> implements IStep {
  start(...s: IStep[]): void {
    this.event.on(this.name, this.f)
    s.forEach(x => x.start())
  }
  ename: string[];
  name: string;
  event: event.EventEmitter;
  f: (a: T) => void
  addEvent(name: string): void {
    throw new Error("Method not implemented.");
  }

  constructor(event: event.EventEmitter, f: (a: T) => void) {
    this.event = event
    this.f = f
  }

}

const e = new event.EventEmitter();

const cs = new CronStep(e);
const filter: filterStep<DistSpace> = new filterStep<DistSpace>(e, (ds) => ds.Capacity >= 90);
const print = new PrintStep<DistSpace>(e, (d) => console.info(d.Filesystem))

cs.sub(filter)
filter.sub(print)

print.start()







// interface IFilterStep<T> {
//   (result: T[], filterFunc: (r: T[]) => T[]): T[]

// }

// function filterStep<T>(result: T[], filterFunc: (r: T[]) => T[]) {
//   return filterFunc(result)
// }

// const task = new Task()
// task.source("collect disk", ).to(filterStep)
