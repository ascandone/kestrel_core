class Task$Task {
  constructor(run) {
    this.run = run;
  }
}

function Task$of(x) {
  return new Task$Task((resolve) => {
    resolve(x);
  });
}

function Task$await(t, f) {
  return new Task$Task((resolveV) => {
    let cleanup;
    let runInner = false;
    const outerCleanup = t.run((valueA) => {
      const newTask = f(valueA);
      cleanup = newTask.run((valueB) => {
        resolveV(valueB);
      });
      runInner = true;
    });

    if (!runInner) {
      cleanup = outerCleanup;
    }

    return () => cleanup?.();
  });
}

function Task$sleep(ms) {
  return new Task$Task((resolve) => {
    const id = setTimeout(resolve, ms, null);
    return () => clearTimeout(id);
  });
}
