# Module `Maybe`

### `type Maybe<a>`

**Constructors:**

- `Just(a)`
- `Nothing`

A type representing an optional value.

### `let map: Fn(Maybe<a>, Fn(a) -> b) -> Maybe<b>`

### `let and_then: Fn(Maybe<a>, Fn(a) -> Maybe<b>) -> Maybe<b>`

### `let map2: Fn(Maybe<a>, Maybe<b>, Fn(a, b) -> c) -> Maybe<c>`

### `let map3: Fn(Maybe<a>, Maybe<b>, Maybe<c>, Fn(a, b, c) -> d) -> Maybe<d>`

### `let with_default: Fn(Maybe<a>, a) -> a`
