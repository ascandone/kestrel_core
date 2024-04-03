import { test, before } from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

let api;

test("Putting on an empty mvar should resolve synchronously", () => {
  let resolved = false;

  api
    .Task$await(api.MVar$empty, (mvar) => api.MVar$put(mvar, 42))
    .run(() => {
      resolved = true;
    });

  assert.equal(resolved, true);
});

test("Putting on an filled mvar should never resolve", (_ctx, done) => {
  api
    .Task$await(api.MVar$empty, (mvar) =>
      api.Task$await(api.MVar$put(mvar, 42), (_unit) => api.MVar$put(mvar, 100))
    )
    .run((value) => {
      assert.fail(
        `This task should not resolve. Instead it resolved with value: ${value}`
      );
    });

  setImmediate(() => {
    done();
  });
});

test("Taking an empty mvar should never resolve", (_ctx, done) => {
  api
    .Task$await(api.MVar$empty, (mvar) => api.MVar$take(mvar))
    .run((value) => {
      assert.fail(
        `This task should not resolve. Instead it resolved with value: ${value}`
      );
    });

  setImmediate(() => {
    done();
  });
});

test("Taking a filled value should resolve synchronously", (ctx) => {
  let resolved = ctx.mock.fn();

  api
    .Task$await(api.MVar$empty, (mvar) =>
      api.Task$await(api.MVar$put(mvar, 42), (_unit) => api.MVar$take(mvar))
    )
    .run(resolved);

  assert.equal(resolved.mock.callCount(), 1);
  assert.deepEqual(resolved.mock.calls[0].arguments, [42]);
});

test("Taking twice never resolves", () => {
  api
    .Task$await(api.MVar$empty, (mvar) =>
      api.Task$await(api.MVar$put(mvar, 42), (_unit) =>
        api.Task$await(api.MVar$take(mvar), (_value) => api.MVar$take(mvar))
      )
    )
    .run((value) => {
      assert.fail(
        `This task should not resolve. Instead it resolved with value: ${value}`
      );
    });
});

test("Taking a mvar that is asynchronously put", (ctx, done) => {
  let runResolver = ctx.mock.fn();
  // let mvar = new()
  // fork({ sleep(); mvar.put(42) })
  // mvar.take()

  let putResolver;

  /** A task that asynchronously puts when "putResolver" is called with such value */
  const asyncPutTask = (mvar) =>
    api.Task$fork(
      api.Task$await(
        new api.Task$Task((resolve) => {
          putResolver = resolve;
        }),
        (value) => api.MVar$put(mvar, value)
      )
    );

  const t = api.Task$await(api.MVar$empty, (mvar) =>
    api.Task$await(asyncPutTask(mvar), (_taskId) => api.MVar$take(mvar))
  );

  t.run(runResolver);

  assert.deepEqual(runResolver.mock.callCount(), 0);
  setImmediate(() => {
    assert.deepEqual(runResolver.mock.callCount(), 0);
    putResolver("some-value");

    assert.deepEqual(runResolver.mock.callCount(), 1);
    assert.deepEqual(runResolver.mock.calls[0].arguments, ["some-value"]);

    done();
  });
});

test("Putting on a mvar that is waiting to take", (_ctx, done) => {
  // let mvar = new()
  // fork({ sleep(); v <- mvar.take(), print(v) })
  // mvar.put(42)

  let takenValue;

  /** A task that asynchronously puts "takeResolver" is called with such value */
  const asyncTakeTask = (mvar) =>
    api.Task$fork(
      api.Task$await(nextTickTask(null), (_null) =>
        api.Task$await(
          api.MVar$take(mvar),
          (value) =>
            new api.Task$Task((resolve) => {
              takenValue = value;
              resolve(null);
            })
        )
      )
    );

  const t = api.Task$await(api.MVar$empty, (mvar) =>
    api.Task$await(asyncTakeTask(mvar), (_taskId) => api.MVar$put(mvar, 42))
  );

  t.run(() => {
    assert.deepEqual(takenValue, undefined);
    setImmediate(() => {
      assert.deepEqual(takenValue, 42);
      done();
    });
  });

  assert.deepEqual(takenValue, undefined);
});

test("Asynchronously putting on a filled MVar", (ctx) => {
  const mockForkCallback = ctx.mock.fn();

  // let mvar = new()
  // mvar.put(1)
  // fork({ mvar.put(2); print("ok") })
  // mvar.take()
  // mvar.take()

  const filledMvarTask = api.Task$await(api.MVar$empty, (mvar) =>
    api.Task$await(api.MVar$put(mvar, 1), (_unit) => api.Task$of(mvar))
  );

  const putForkTask = (mvar) =>
    api.Task$fork(
      api.Task$await(
        // put on a mvar that is already filled
        api.MVar$put(mvar, 2),
        (_unit) =>
          new api.Task$Task((res) => {
            mockForkCallback();
            res(null);
          })
      )
    );

  const t = api.Task$await(filledMvarTask, (mvar) =>
    api.Task$await(putForkTask(mvar), (_unit) =>
      api.Task$await(api.MVar$take(mvar), (_value) => api.MVar$take(mvar))
    )
  );

  t.exec();

  assert.equal(mockForkCallback.mock.callCount(), 1);
});

function nextTickTask(value) {
  return new api.Task$Task((resolve) => {
    setImmediate(() => {
      resolve(value);
    });
  });
}

before(async () => {
  const taskFile = await readFile("src/Task.js");
  const mvarFile = await readFile("src/MVar.js");

  api = new Function(`
    ${taskFile}
    ${mvarFile}
    return {
      MVar$empty,
      MVar$put,
      MVar$take,
      Task$Task,
      Task$of,
      Task$await,
      Task$fork,
    }
  `)();
});
