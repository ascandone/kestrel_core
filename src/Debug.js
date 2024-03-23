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
  } else if (x.type === undefined) {
    return "<internals>";
  } else {
    const { type, ...args } = x;
    if (type === "Nil") {
      return "[]";
    }

    const keys = Object.keys(args).sort();

    if (keys.length === 0) {
      return `${type}`;
    }

    if (type === "Cons") {
      const buf = [];
      while (x.type === "Cons") {
        buf.push(Debug$inspect(x.a0));
        x = x.a1;
      }

      return `[${buf.join(", ")}]`;
    }

    const keysList = keys.map((k) => Debug$inspect(args[k])).join(", ");

    if (type.startsWith("Tuple")) {
      return `(${keysList})`;
    }

    return `${type}(${keysList})`;
  }
}

function Debug$todo(description) {
  throw new Error(`TODO: ${description}`);
}
