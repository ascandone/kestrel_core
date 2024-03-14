# Module `Result`

### `type List<a>`

**Constructors:**

- `Nil`
- `Cons(a, List<a>)`

A type representing a value that could be either succesful or not.

### `let range: Fn(Int, Int) -> List<Int>`

### `let map: Fn(List<a>, Fn(a) -> b) -> List<b>`

### `let map2: Fn(List<a>, List<b>, Fn(a, b) -> b) -> List<c>`

### `let find: Fn(List<a>, Fn(a) -> Bool) -> Maybe<a>`

### `let filter: Fn(List<a>, Fn(a) -> Bool) -> List<a>`

### `let reduce: Fn(List<a>, b, Fn(b, a) -> b) -> b`

### `let reduce_right: Fn(List<a>, b, Fn(a, b) -> b) -> b`

### `let concat: Fn(List<a>, List<a>) -> List<a>`

### `let flatten: Fn(List<List<a>>) -> List<a>`

### `let flat_map: Fn(List<a>, Fn(a) -> b) -> List<b>`

### `let filter_map: Fn(List<a>, Fn(a) -> Maybe<b>) -> List<b>`

### `let take: Fn(List<a>, Int) -> List<a>`

### `let drop: Fn(List<a>, Int) -> List<a>`

### `let is_empty: Fn(List<a>) -> Bool`

### `let length: Fn(List<a>) -> Int`

### `let zip: Fn(List<a>, List<b>) -> List<(a, b)>`
