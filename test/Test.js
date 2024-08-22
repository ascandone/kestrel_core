function Test$unwrap_panic(f) {
  try {
    return Result$Ok(f());
  } catch (error) {
    return Result$Err(error.stack);
  }
}
