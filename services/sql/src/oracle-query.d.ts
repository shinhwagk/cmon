/// <reference types="oracledb" />
import * as oracledb from "oracledb";
export declare function executeQuery(connect: oracledb.IConnectionAttributes, sql: string, args: any[]): Promise<any>;
