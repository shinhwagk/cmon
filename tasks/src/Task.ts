import * as event from "events"

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

function cronStep(command: string, s: number, f: (command: string) => string, nexts: string[], event: event.EventEmitter) {
  function a(result: string) {
    nexts.forEach(name => event.emit(name, result))
  }
  setInterval(() => a(f(command)), s)
}

// interface IFilterStep<T> {
//   (result: T[], filterFunc: (r: T[]) => T[]): T[]

// }

// function filterStep<T>(result: T[], filterFunc: (r: T[]) => T[]) {
//   return filterFunc(result)
// }

// const task = new Task()
// task.source("collect disk", ).to(filterStep)

cronStep()