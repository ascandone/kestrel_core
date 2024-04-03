import { test } from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { promisify } from "node:util";
import { exec as exec_ } from "node:child_process";
import { readdirSync } from "node:fs";

const wdir = "integration-tests";

const exec = promisify(exec_);

const content = readdirSync(`${wdir}/src`)
  .filter((f) => f.endsWith("Tests.kes"))
  .map((f) => f.replace(".kes", ""));

assert(content.length !== 0, "empty test suite");

for (const fileName of content) {
  test(fileName, async () => {
    const { stdout } = await exec(`npx kestrel run ${fileName}`, {
      cwd: wdir,
    });

    const expected = await readFile(`${wdir}/src/${fileName}.out`);
    assert.strictEqual(stdout, expected.toString());
  });
}
