function Debug$todo(description) {
  throw new Error(`TODO ${description}`);
}

function Debug$log_str(value, description) {
  console.log(description + ":", value);
  return Tuple$Unit;
}
