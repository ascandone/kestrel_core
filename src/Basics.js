function Basics$_eq(x, y) {
  if (x === y) {
    return true;
  }

  const t = typeof x;
  if (
    t === "boolean" ||
    t === "number" ||
    t === "string" ||
    t === "undefined" ||
    t === "function" ||
    x.type === undefined
  ) {
    return false;
  }

  for (prop in x) {
    if (!Basics$_eq(x[prop], y[prop])) {
      return false;
    }
  }

  return true;
}
