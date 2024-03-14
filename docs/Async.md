# Module `Async`

This module defines some high-level utilities to create concurrent `Task`s.

#### `let both: Fn(Task<a>, Task<b>) -> Task<(a, b)>`

Run the two tasks concurrently and collect the results.

**example**

```rust
pub let main = {
  let#await (a, b) = Async.both(
    Task.map(Task.sleep(1000), fn _ {
      0
    }),
    Task.map(Task.sleep(1000), fn _ {
      1
    }),
  );
  // Resolves with a=0 and b=1
  // in 1 second instead of 2
  Task.none
}
```

#### `let both_ok: Fn(Task<Result<a, b>>, Result<a, b>) -> Task<Result<(a, a), b>>`

Run the two `Task`s concurrently. Return `Ok` if both `Task`s succeeed, otherwise return `Err` with the first task that fails, and cancel the other.

#### `let race: Fn(List<Task<a>>) -> Task<a>`

Run the tasks concurrently and yield the value of the first `Task` to complete. All the other tasks are cancelled.

**example**

```rust
pub let main = {
  let#await a = Async.race([
    Task.map(Task.sleep(1000), fn _ {
      0
    }),
    Task.map(Task.sleep(200), fn _ {
      1
    }),
  ]);
  // Resolves with a=1 in 200ms
  Task.none
}
```
