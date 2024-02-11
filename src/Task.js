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
    const c1 = t.run((valueA) => {
      const newTask = f(valueA);
      const c2 = newTask.run((valueB) => {
        resolveV(valueB);
        return () => c2?.();
      });
    });
    return () => c1?.();
  });
}

function Task$sleep(ms) {
  return new Task$Task((resolve) => {
    const id = setTimeout(resolve, ms, null);
    return () => clearTimeout(id);
  });
}
