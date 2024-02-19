function IO$println(str) {
  return new Task$Task((resolve) => {
    console.log(str);
    resolve(null);
  });
}

function IO$print(str) {
  const { stdout } = require("node:process");
  return new Task$Task((resolve) => {
    stdout.write(str);
    resolve(null);
  });
}

const IO$readline = new Task$Task((resolve) => {
  const { stdin } = require("node:process");
  const { createInterface } = require("node:readline");
  const rl = createInterface({ input: stdin });
  rl.question("", (line) => {
    rl.close();
    resolve(line);
  });
  return () => rl.close();
});

const IO$exit = (code) =>
  new Task$Task(() => {
    setImmediate(() => {
      const proc = require("node:process");
      proc.exit(code);
    }, 0);
  });
