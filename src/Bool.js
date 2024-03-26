function Bool$_eq(x, y) {
  if (x === y) {
    return true;
  }

  if (x instanceof String) {
    return x.toString() === y.toString();
  }

  if (
    typeof x === "boolean" ||
    typeof x === "number" ||
    typeof x === "string" ||
    typeof x === "undefined" ||
    typeof x === "function" ||
    x.$ === undefined
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
