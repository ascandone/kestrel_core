# Module `MVar`

### `type MVar<a>`

A `MVar` is a synchronization primitives, useful for communicating from different forked tasks. Represents a mutable cell that can either be empty or filled with a value of type `a`.

### `let empty: Task<MVar<a>>`

Create an empty `MVar`

### `let put: Fn(MVar<a>, a) -> Task<Unit>`

Put a value into the given `MVar`. If the `MVar` is filled, it will block until it is possible to put.

### `let take: Fn(MVar<a>) -> Task<a>`

Take the value from the given `MVar`. If the `MVar` is not filled, it will block until it is possible to take.

### `let of: Fn(a) -> Task<MVar<a>>`

Create a `MVar` filled with the given value.
