export interface OSEndPoint {
  name: string;
  ip: string;
}

export interface OracleEndPoint {

}

export const OSEndPoints: OSEndPoint[] = [
  { ip: "127.0.0.1", name: "test" },
  { ip: "127.0.0.1", name: "test2" },
]

export const OracleEndPoints = [
  { name: "yali2", connectString: "10.65.193.25:1521/orayali2", user: "system", password: "oracle" }
]