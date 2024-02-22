import { test, before, mock } from "node:test";
import { readFile } from "node:fs/promises";
import assert from "node:assert/strict";

let api;

test("A Task is lazy", (ctx) => {
  const f = ctx.mock.fn();
  new api.Task$Task(() => {
    f();
  });
  assert.equal(f.mock.callCount(), 0);
});

test("A Task can be executed many times", (ctx) => {
  const f = ctx.mock.fn();
  const t = new api.Task$Task(() => {
    f();
  });
  t.run(() => {});
  assert.equal(f.mock.callCount(), 1);
  t.run(() => {});
  assert.equal(f.mock.callCount(), 2);
});

test("handles cancellation function", (context) => {
  const cleanUp = context.mock.fn();

  const t = new api.Task$Task(() => {
    return () => {
      cleanUp();
    };
  });

  const cancelTask = t.run(() => {});

  assert.equal(
    cleanUp.mock.callCount(),
    0,
    "cleanUp fn is not called initially"
  );
  cancelTask();
  assert.equal(
    cleanUp.mock.callCount(),
    1,
    "cleanUp fn is called when task is cancelled"
  );
});

test("Task.await", (_ctx, done) => {
  api
    .Task$await(api.Task$of(100), (value) => api.Task$of(value + 1))
    .run((value) => {
      assert.equal(value, 101);
      done();
    });
});

test("Task.of always resolves with given value", (ctx, done) => {
  api.Task$of(42).run((value) => {
    assert.equal(value, 42);
    done();
  });
});

before(async () => {
  const file = await readFile("src/Task.js");
  const content = file.toString();

  // please god forgive me
  api = new Function(`
    ${content}
    return {
      Task$Task,
      Task$of,
      Task$await,
      Task$sleep,
    }
  `)();
});
