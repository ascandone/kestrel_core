const { stdin } = require("node:process");
const { createInterface } = require("node:readline");

function IO$println(str) {
  return new Task$Task((resolve) => {
    console.log(str);
    resolve(null);
  });
}

function IO$print(str) {
  return new Task$Task((resolve) => {
    process.stdout.write(str);
    resolve(null);
  });
}

const IO$readline = new Task$Task((resolve) => {
  const rl = createInterface({ input: stdin });
  rl.question("", (line) => {
    rl.close();
    resolve(line);
  });
  return () => rl.close();
});
