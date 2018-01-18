import * as Koa from "koa";
import * as KoaRouter from "koa-router";

const koa = new Koa();
const koaRouter = new KoaRouter();

koaRouter.post("/v1/service/:service", (xxx: any)={});
koaRouter.get("/v1/monitor/:monitor/server", () = {});

koa.use(koaRouter.routes()).use(koaRouter.allowedMethods());

koa.listen(8080);

interface ITaskToService {
    task: string;
    step: string;
    endpoint: string;
    content: string;
}
