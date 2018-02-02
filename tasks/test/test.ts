import * as mocha from "mocha";
import * as assert from "assert";

import * as tasks from "../src/Task"

interface DiskSpace {
  Filesystem: string;
  Blocks: number;
  Used: number;
  Available: number;
  Capacity: number;
  MountedOn: number;
}

interface OSEndPoint {
  name: string;
  ip: string;
}

describe('exec bash command', () => {
  it('should length >= 1 when the value is not present', async () => {
    const disks: DiskSpace[] = await tasks.execCommand<DiskSpace, OSEndPoint>("disk")({ ip: "127.0.0.1", name: "abc" })
    assert.equal(disks.length >= 1, true)
  });
  it('should length >= 2 when the value is not present', async () => {
    const disks: DiskSpace[] = await tasks.execCommand<DiskSpace, OSEndPoint>("disk")({ ip: "127.0.0.1", name: "abc" })
    assert.equal(disks.length >= 1, true)
  });
});

describe('exec sql command', () => {
  it('should return -1 when the value is not present', async () => {
    interface DUAL { DUMMY: string }
    const rows = await tasks.execSql<DUAL>("select * from dual", [])("yali2")
    assert.equal(rows[0].DUMMY, "X")
  });
});