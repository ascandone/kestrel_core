function Log$log_str(str) {
  return new Task$Task((resolve) => {
    console.log(str);
    resolve(null);
  });
}
