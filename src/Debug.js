function Debug$inspect(x) {
  if (x === true) {
    return "True";
  } else if (x === false) {
    return "False";
  } else if (x === null) {
    return "Unit";
  } else if (typeof x === "number") {
    return x.toString();
  } else if (typeof x === "function") {
    return "#[Function]";
  } else if (typeof x === "string") {
    return `"${x}"`;
  } else if (x instanceof String) {
    return `'${x}'`;
  } else if (x.$ === undefined) {
    return "<internals>";
  } else {
    const { $, ...args } = x;
    if (x.$ === "Nil") {
      return "[]";
    }

    const keys = Object.keys(args).sort();

    if (keys.length === 0) {
      return `${x.$}`;
    }

    if (x.$ === "Cons") {
      const buf = [];
      while (x.$ === "Cons") {
        buf.push(Debug$inspect(x.a0));
        x = x.a1;
      }

      return `[${buf.join(", ")}]`;
    }

    const keysList = keys.map((k) => Debug$inspect(args[k])).join(", ");

    if (x.$.startsWith("Tuple")) {
      return `(${keysList})`;
    }

    return `${x.$}(${keysList})`;
  }
}

function Debug$todo(description) {
  throw new Error(`TODO ${description}`);
}

function Debug$log(description, value) {
  console.log(description, Debug$inspect(value));
  return value;
}
