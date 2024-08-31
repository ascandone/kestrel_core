class MVar$MVar {
  state = { empty: true };
  pendingPuts = [];
  pendingTakes = [];
}

const MVar$empty = new Task$Task((resolve) => {
  resolve(new MVar$MVar());
});

function MVar$put(mvar, value) {
  return new Task$Task((resolve) => {
    const pendingTake = mvar.pendingTakes.shift();
    if (pendingTake !== undefined) {
      pendingTake(value);
      resolve(null);
      return;
    }

    if (!mvar.state.empty) {
      mvar.pendingPuts.push([resolve, value]);
      return () => {
        mvar.pendingPuts = mvar.pendingPuts.filter(
          ([resolve_, _]) => resolve_ !== resolve,
        );
      };
    }

    mvar.state = {
      empty: false,
      value,
    };
    resolve(null);
  });
}

function MVar$take(mvar) {
  return new Task$Task((resolve) => {
    if (!mvar.state.empty) {
      const { value } = mvar.state;
      mvar.state = { empty: true };
      resolve(value);
      return;
    }

    const pendingPut = mvar.pendingPuts.shift();
    if (pendingPut !== undefined) {
      const [resolvePut, value] = pendingPut;
      resolve(value);
      resolvePut();
      return;
    }

    mvar.pendingTakes.push(resolve);
    return () => {
      mvar.pendingTakes = mvar.pendingTakes.filter((resolve_) => {
        resolve_ !== resolve;
      });
    };
  });
}
