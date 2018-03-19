import { httpRest } from "cmon-task-lib";

import { ApiTaskEndpoint as ate } from "../services-config";

export function getEndpoint<P>(kind: string, name: string): Promise<P[]> {
    const options = httpRest.ReqOptions(ate.host, "GET", ate.makeUrl(kind, name), ate.port);
    return httpRest.createHttpRestClient(options).then((ps) => ps as P[]);
}
