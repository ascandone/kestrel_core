# kestrel_core

[![CI](https://github.com/ascandone/kestrel_core/actions/workflows/ci.yml/badge.svg)](https://github.com/ascandone/kestrel_core/actions/workflows/ci.yml)

Standard library for [Kestrel lang](https://github.com/ascandone/kestrel-lang).

This package will be needed by every Kestrel module, which will implicitly have the following imports:

```kestrel
import Int.{(+), (-), (*), (/), (^), (%)}
import Float.{(+.), (-.), (*.), (/.)}
import Bool.{Bool(..), (&&), (||), (!), (==), (!=), (<), (<=), (>), (>=)}
import Char.{Char}
import String.{String, (++)}
import Option.{Option(..)}
import Result.{Result(..)}
import Tuple.{Unit(..), Tuple2(..), Tuple3(..), Tuple4(..)}
import List.{List(..)}
import Task.{Task}
```

You can find module documentation [here](https://kestrel-module-docs.vercel.app/ascandone/kestrel_core/)
