class Task$Task {
  constructor(run) {
    this.run = run;
  }

  exec() {
    let cancel;
    cancel = this.run(() => {
      cancel?.();
    });
    return cancel;
  }
}

function Task$of(x) {
  return new Task$Task((resolve) => {
    resolve(x);
  });
}

const Task$never = new Task$Task(() => {});

function Task$await(t, f) {
  return new Task$Task((resolveV) => {
    let innerCleanup;
    const outerCleanup = t.run((valueA) => {
      const newTask = f(valueA);
      innerCleanup = newTask.run((valueB) => {
        resolveV(valueB);
      });
    });

    return () => {
      outerCleanup?.();
      innerCleanup?.();
    };
  });
}

function Task$sleep(ms) {
  return new Task$Task((resolve) => {
    const id = setTimeout(resolve, ms, null);
    return () => clearTimeout(id);
  });
}

class Task$Id {
  constructor(cancel) {
    this.cancel = cancel;
  }
}

function Task$fork(t) {
  return new Task$Task((resolve) => {
    const cancel = t.run(() => {});
    resolve(new Task$Id(cancel));
    return cancel;
  });
}

function Task$kill(id) {
  return new Task$Task((resolve) => {
    id.cancel();
    resolve(null);
  });
}
