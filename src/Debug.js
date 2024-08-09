const Show_Int$Int = (n) => n.toString();
const Show_Float$Float = (n) => {
  if (Math.round(n) === n) {
    return `${n}.0`;
  }

  return n.toString();
};
const Show_String$String = (s) => `"${s}"`;
const Show_Char$Char = (c) => `'${c}'`;

const Show_Bool$Bool = (n) => {
  if (n) {
    return "True";
  }
  return "False";
};

const Show_List$List = (Show_a) => (x) => {
  const buf = [];
  while (x.$ != "Nil") {
    buf.push(Show_a(x.a0));
    x = x.a1;
  }
  return `[${buf.join(", ")}]`;
};

const Debug$inspect = (Show) => (x) => Show(x);

function Debug$todo(description) {
  throw new Error(`TODO ${description}`);
}

function Debug$log(value, description) {
  console.log(description + ":", Debug$inspect(value));
  return value;
}
