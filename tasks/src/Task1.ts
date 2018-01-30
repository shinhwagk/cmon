import { EventEmitter } from "events";
import * as http from "http";



import { DiskSpace } from './metric/DiskSpace';
import { OSEndPoints, OSEndPoint } from "./EndPoint"
import { setInterval } from "timers";

type SourceType = (p: any, d: any) => void
type FlowType = (emit: any) => (point: any, elem: any) => void
type SinkType = FlowType

type HasDownStream = (...args: any[]) => void
type NotDownStream = () => void

function FilterStep1<T>(name: string, filterFunc: (elem: T) => boolean): [string, FlowType, any] {
    const listener: FlowType = (emit: HasDownStream) => (point: any, elem: T) => {
        if (filterFunc(elem)) { emit(point, elem) }
    }
    return [name, listener, undefined]
}

function CreoStep<M, P>(name: string, interval: number, points: P[], execCommand: (point: P) => Promise<M[]>) {
    const handler = (emit: any) => {
        setInterval(() => {
            const date = (new Date).getTime()
            points.forEach(p => {
                execCommand(p).then(r => r.forEach(x => emit(p, x)))
            })
        }, interval)
    };

    const listener: SourceType = (emit: HasDownStream) => (point: any, elem: M) => {
        emit(point, elem)
    }

    return [name, listener, handler]
}


function PrintStep<P, T>(name: string, PrintFunc: (point: P, elemt: T) => void) {
    const listener: FlowType = (emit: (...args: any[]) => void) => (point: P, elem: T) => {
        PrintFunc(point, elem)
    }
    return [name, listener, undefined]
}

// type Gtype = [SourceType | FlowType, FlowType | SinkType | (FlowType | SinkType)[]]

function sss(...g: any[]) {
    const e: EventEmitter = new EventEmitter();

    const emit = (...dnames: string[]) => (point: any, data: any) => {
        dnames.forEach(dname => {
            console.info(`send to ${dname}, point:${point["name"]}.`)
            e.emit(dname, point, data)
        })
    }

    const registerListener = (name: string, listener: (...args) => void) => {
        e.on(name, listener)
    }

    for (const [s, f] of g) {
        const [name, listener, handler] = s
        registerListener(name, listener(["aaa"]))
        handler(emit(name))
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

const cs = CreoStep("cron", 15000, OSEndPoints, execCommand)
const filter = FilterStep1<DiskSpace>("filter", (ds) => ds.Capacity >= 10)
const print1 = PrintStep("print", (p, d) => console.info(p, (new Date).getMilliseconds(), d))

const g = [
    [cs, filter],
    [filter, print1]
]

sss(g)

