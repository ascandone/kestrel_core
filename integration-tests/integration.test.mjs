import { test } from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { promisify } from "node:util";
import { exec as exec_ } from "node:child_process";
import { readdirSync } from "node:fs";

const exec = promisify(exec_);

const content = readdirSync("src")
  .filter((f) => f.endsWith("Tests.kes"))
  .map((f) => f.replace(".kes", ""));

for (const fileName of content) {
  test(fileName, async () => {
    const { stdout } = await exec(`kestrel run ${fileName}`);

    const expected = await readFile(`src/${fileName}.out`);
    assert.strictEqual(stdout, expected.toString());
  });
}
