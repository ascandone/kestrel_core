function Test$unwrap_panic(f) {
  try {
    return { type: "Ok", a0: f() };
  } catch (error) {
    return { type: "Err", a0: error.stack };
  }
}
