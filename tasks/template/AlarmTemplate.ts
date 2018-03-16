// /v1/metric/:name
import { HttpServerStep } from "../Steps/HttpServerStep";

interface IAlarmInfo<T> {
    metric: T;
    name: string;
}

interface IAlarmRuleWithDesc<T> {
    filter(elem: T): boolean;
    send(elem: T): void;
}

const f = [];
