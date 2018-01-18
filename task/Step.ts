import * as EventEmitter from 'events';

interface Step {
  name: string;
  handler: (args) => void;
  endPoints: any[]
}

interface CronStepInterface extends Step {
  cronExpression: string;
}

interface SubscribeStep extends Step {
  task: string;
  step: string;
}

// interface ServiceStep extends Step {
//   service: string;
// }

class ProcessStep implements Step {
  name: string;
  handler: (args: any) => void;
  endPoints: any[];

}

class ServiceStep implements Step {
  name: string;
  handler: (args: any) => void;
  endPoints: any[];

}

class CronStep implements CronStepInterface {
  endPoints: any[];
  cronExpression: string;
  name: string;
  handler: (args) => void;

  constructor(name, cronExpression, hanlder, endPoints) {
    this.cronExpression = cronExpression;
    this.name = name;
    this.handler = hanlder;
    this.endPoints = endPoints;
  }
}

const cronStep = new CronStep("sss", "* * * 8 8 ", () => { }, [])
const serviceStep = new ServiceStep()

type xxx = [Step, string, Step]

const graph: xxx[] = [
  [cronStep, "->", serviceStep],
  [serviceStep, "->", serviceStep],
  [serviceStep, "->", serviceStep],
  [serviceStep, "->", serviceStep]
]

function toDown(downName: string[], handler, e: EventEmitter) {
  const h = handler()
  downName.forEach(name => e.emit(name, h))
}

const uu = () => () => "aaa"

function genGraph(g: [Step, string, Step][]) {
  const event: EventEmitter = new event.eventNames();
  const map: Map<string, string[]> = new Map();

  for (const [up, p, down] of g) {
    if (map.has(up.name)) {
      map.get(up.name).push(down.name)
    } else {
      map.set(up.name, [])
    }
  }
}