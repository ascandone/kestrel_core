class MVar$MVar {
  state = { empty: true };
  pendingPuts = [];
  pendingTakes = [];

  tryPut(value) {
    const pendingTake = this.pendingTakes.shift();
    if (pendingTake !== undefined) {
      pendingTake(value);
      return true;
    } else if (!this.state.empty) {
      return false;
    } else {
      this.state = {
        empty: false,
        value,
      };
      return true;
    }
  }

  tryTake() {
    if (!this.state.empty) {
      const { value } = this.state;
      this.state = { empty: true };
      return { $: /* Some */ 0, _0: value };
    }

    const pendingPut = this.pendingPuts.shift();
    if (pendingPut !== undefined) {
      const [resolvePut, value] = pendingPut;
      resolvePut();
      return { $: /* Some */ 0, _0: value };
    }

    return { $: /* None */ 1 };
  }
}

const MVar$empty = new Task$Task((resolve) => {
  resolve(new MVar$MVar());
});

function MVar$put(mvar, value) {
  return new Task$Task((resolve) => {
    const put = mvar.tryPut(value);
    if (put) {
      resolve(null);
      return;
    }

    mvar.pendingPuts.push([resolve, value]);
    return () => {
      mvar.pendingPuts = mvar.pendingPuts.filter(
        ([resolve_, _]) => resolve_ !== resolve,
      );
    };
  });
}

function MVar$try_put(mvar, value) {
  return new Task$Task((resolve) => {
    const put = mvar.tryPut(value);
    resolve(put);
  });
}

function MVar$take(mvar) {
  return new Task$Task((resolve) => {
    const opt = mvar.tryTake();
    switch (opt.$) {
      case /* Some */ 0:
        resolve(opt._0);
        return;
      case /* None */ 1:
        mvar.pendingTakes.push(resolve);
        return () => {
          mvar.pendingTakes = mvar.pendingTakes.filter((resolve_) => {
            resolve_ !== resolve;
          });
        };
    }
  });
}

function MVar$try_take(mvar) {
  return new Task$Task((resolve) => {
    resolve(mvar.tryTake());
  });
}

function MVar$take_async(mvar) {
  return new Task$Task((resolve) => {
    const opt = mvar.tryTake();
    switch (opt.$) {
      case /* Some */ 0:
        resolve(opt._0);
        return;
      case /* None */ 1:
        mvar.pendingTakes.push(resolve);
        return () => {
          mvar.pendingTakes = mvar.pendingTakes.filter((resolve_) => {
            resolve_ !== resolve;
          });
        };
    }
  });
}

function MVar$try_take(mvar) {
  return new Task$Task((resolve) => {
    resolve(mvar.tryTake());
  });
}
