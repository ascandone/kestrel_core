# Module `Result`

### `type Result<value, error>`

**Constructors:**

- `Ok(value)`
- `Err(error)`

A type representing a value that could be either succesful or not.

### `let map: Fn(Result<a, err>, Fn(a) -> b) -> Result<b, err>`

### `let map_err: Fn(Result<a, err>, Fn(err) -> err1) -> Result<a, err1>`

### `let and_then: Fn(Result<a, err>, Fn(a) -> Result<b>) -> Result<b>`
