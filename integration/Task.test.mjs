import { test, before, describe } from "node:test";
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

describe("Task.of", () => {
  test("always resolves with given value", (ctx, done) => {
    api.Task$of(42).run((value) => {
      assert.equal(value, 42);
      done();
    });
  });
});

describe("Task.await", () => {
  test("creates a new task using the given function", (_ctx, done) => {
    api
      .Task$await(api.Task$of(100), (value) => api.Task$of(value + 1))
      .run((value) => {
        assert.equal(value, 101);
        done();
      });
  });

  test("run cleanup function on the first task if second hasn't been executed yet", (ctx) => {
    const cleanUp = ctx.mock.fn();

    const t = api.Task$await(
      new api.Task$Task(() => {
        return cleanUp;
      }),
      () => {
        assert.fail("The first task should never be resolved");
      }
    );

    const cancel = t.run();
    cancel();

    assert.deepEqual(cleanUp.mock.callCount(), 1);
  });

  test("run cleanup function on the second task if it has started", (ctx) => {
    const cleanUp = ctx.mock.fn();

    const t = api.Task$await(
      api.Task$of(null),
      () => new api.Task$Task(() => cleanUp)
    );

    const cancel = t.run();
    cancel();

    assert.deepEqual(cleanUp.mock.callCount(), 1);
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
