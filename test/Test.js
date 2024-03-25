function Test$unwrap_panic(f) {
  try {
    return { $: "Ok", a0: f() };
  } catch (error) {
    return { $: "Err", a0: error.stack };
  }
}
