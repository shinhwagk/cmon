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

describe('Array', () => {
  it('should length >= 1 when the value is not present', async () => {
    const disks: DiskSpace[] = await tasks.execCommand<DiskSpace, OSEndPoint>("disk")({ ip: "127.0.0.1", name: "abc" })
    assert.equal(disks.length >= 1, true)
  });
});