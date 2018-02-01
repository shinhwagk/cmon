import { EventEmitter } from "events";
import * as http from "http";
import { setInterval } from "timers";

import * as Influx from "influx";

// import { DiskSpace } from './metric/DiskSpace';
// import { OSEndPoints, OSEndPoint } from "./EndPoint"

export type FlowType = (emit: any) => (point: any, elem: any) => void

type DownStreamEmitter = (...args: any[]) => void

export type Step = [string, FlowType | null, any]

function FilterStep<P, T>(name: string, filterFunc: (elem: T) => boolean): Step {
    const listener: FlowType = (emit: DownStreamEmitter) => (point: P, elem: T) => {
        if (filterFunc(elem)) { emit(point, elem) }
    }
    return [name, listener, null]
}

function CreoStep<M, P>(name: string, interval: number, points: P[], execCommand: (point: P) => Promise<M[]>): Step {
    const handler = (emit: any) => {
        setInterval(() => {
            const date = (new Date).getTime()
            points.forEach(p => {
                execCommand(p).then(r => r.forEach(x => emit(p, x)))
            })
        }, interval)
    };

    const listener: FlowType = (emit: DownStreamEmitter) => (point: P, elem: M) => {
        emit(point, elem)
    }

    return [name, null, handler]
}

function PrintStep<P, T>(name: string, PrintFunc: (point: P, elemt: T) => void): Step {
    const listener: FlowType = (emit: DownStreamEmitter) => (point: P, elem: T) => {
        PrintFunc(point, elem)
    }
    return [name, listener, null]
}

function InfluxStep<P, M>(name: string, measurement: string, tags: (point: P, elem: M) => {}, values: (point: P, elem: M) => {}): Step {
    const influx = new Influx.InfluxDB({ host: '10.65.193.51', database: 'mydb' })

    const listener: FlowType = (emit: DownStreamEmitter) => (point: P, elem: M) => {
        influx.writePoints([
            {
                measurement: measurement,
                tags: tags(point, elem),
                fields: values(point, elem),
                timestamp: (new Date).getTime() * 1000000
            }
        ])
    }
    return [name, listener, null]
}

function sss(ss: Step[][]) {
    const e: EventEmitter = new EventEmitter();
    const isds: { [name: string]: string[] } = {};
    const steps: Step[] = [];

    const emit = (...dnames: string[]) => (point: any, data: any) => {
        dnames.forEach(dname => {
            console.info(`send to ${dname}, point:${point["name"]}.`)
            e.emit(dname, point, data)
        })
    }

    const registerDownStream = (name: string, dname: string) => {
        if (!isds[name]) { isds[name] = [] }
        isds[name].push(dname)
    }

    const registerListener = (name: string, listener: (...args: any[]) => void) => {
        e.on(name, listener)
    }

    const addStepIfNoExist = (is: Step) => {
        if (steps.indexOf(is) <= -1) {
            steps.push(is)
        }
    }

    for (const s of ss) {
        if (s.length <= 1) {
            console.error("gragp than 1."); return;
        }
        const [name, listener, handler] = s[0]

        addStepIfNoExist(s[0])

        s.shift()
        s.forEach(step => registerDownStream(name, step[0]))

        s.forEach(step => addStepIfNoExist(step))
    }

    const startListener = () => {
        for (const s of steps.reverse()) {
            const dNames: string[] = isds[s[0]]
            const emit = (point: any, data: any) => dNames.forEach(dname => {
                console.info(`send to ${dname}, point:${point["name"]}.`)
                e.emit(dname, point, data)
            })

            if (s[1]) {
                console.info(`start listen ${s[0]}.`)
                registerListener(s[0], (<FlowType>s[1])(emit))
            }

            if (s[2]) {
                console.info(`start localProcess ${s[0]}.`)
                s[2](emit)
            }
        }
    }

    startListener()
}

import * as fs from "fs"
const execCommand = <M, T extends { ip: string }>(name: string) => (p: T) => {
    return new Promise<M[]>((r, x) => {
        console.info(`http://${p.ip}:8000/v1/script/${name}`)
        http.get(`http://${p.ip}:8000/v1/script/${name}`, (res) => {
            const data: Buffer[] = []
            res.on("data", (chunk: Buffer) => { data.push(chunk) })
            res.on('end', () => {
                try {
                    r(<M[]>JSON.parse(data.toString()))
                } catch (e) {
                    console.error("error str " + data + "error str .")
                    console.error(`${e},${data.toString()}`)
                    fs.writeFile("./error.log", e + data.toString(), (e) => { console.info(e) })
                }
            })
        })
    })
}

// const cs: Step = CreoStep<DiskSpace, OSEndPoint>("cron", 15000, OSEndPoints, execCommand)
// const filter: Step = FilterStep<OSEndPoint, DiskSpace>("filter", (ds) => ds.Capacity >= 10)
// const print: Step = PrintStep("print", (p, d) => console.info(p, (new Date).getMilliseconds(), d))
// const influx: Step = InfluxStep("influx", "disk1", [], [])

// const g: Step[][] = [
//     [cs, filter, influx],
//     [filter, print]
// ]

// sss(g)

export { execCommand, sss, InfluxStep, CreoStep, FilterStep, PrintStep }
