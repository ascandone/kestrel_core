function Bool$_eq(x, y) {
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
    if (!Bool$_eq(x[prop], y[prop])) {
      return false;
    }
  }

  return true;
}
