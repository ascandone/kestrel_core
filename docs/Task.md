# Module `Task`

#### `type Task<a>`

A task represents a computation (either synchronous or asynchronous) that yiels a value of type `a`. Unlike javascript's `Promise`, creating a `Task` doesn't actually do anything. The only way to actually run the task is to assign it to the `main` function of the entrypoint module.

Another difference from `Promise` is that `Task` doesn't encode failure: to represent a `Task` that might yield an error value you can use the `Task<Result<value, error>>` type.
Also unlike `Promise`, a task might either be a synchronous operation or a microtask.

#### `let of: Fn(a) -> Task<a>`

Lift a value into a `Task`. The resulting `Task` might either be synchronous or asynchronous (the behaviour is unspecified).

#### `let none: Task<Unit>`

A task that does not do anything.
Same as `Task.of(Unit)`.

#### `let await: Fn(Task<a>, Fn(a) -> Task<b>) -> Task<b>`

Use the result of a `Task` to create a new `Task`. This function does not execute the `Task`, it only describes a new computation. It is the main primitive to (_sequentially_) chain computation.

```rust
IO.readline
|> Task.await(fn value {
  IO.println("Input: " <> value)
})
```

#### `let never: Task<a>`

A task that never resolves.

#### `let map: Fn(Task<a>, Fn(a) -> b) -> Task<b>`

Create a new `Task` in which the current value is mapped according to the given function.

#### `let sleep: Fn(Int) -> Task<Unit>`

Pause the execution for the given number of milliseconds

#### `type Id`

Identifier of a forked `Task`.

#### `let fork: Fn(Task<Unit>) -> Task<Id>`

Run the given computation concurrently. The `Id` is returned synchronously, thus there is no way to receive data from the forked `Task` or wait for it to finish. In order to accomplish that, the `MVar` synchronization primitive is provided in the `MVar` module.

`fork` is a low-level primitive and you probably might want to use the higher-level `Async` module to perform concurrent computation.

#### `let kill: Fn(Id) -> Task<Unit>`

Kill the computation with the given `Id`. Cancellation will be propagated recursively though its forks and awaited tasks.
For example:

```rust
pub let main = {
  let#await task_id = Task.fork({
    let#await _unit = Task.sleep(2000);
    Task.println("Finished sleeping")
  });
  // Killing this computation prevents the
  // message to be printed
  Task.kill(task_id)
}
```

Killing a terminated computation is a noop.

#### `let await_ok: Fn(Task<Result<a, b>>, Fn(a) -> Task<Result<c, b>>) -> Task<Result<c, b>>`
