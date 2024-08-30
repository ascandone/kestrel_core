const Eq_Int$Int = (x, y) => x === y;
const Eq_Float$Float = (x, y) => x === y;
const Eq_String$String = (x, y) => x === y;
const Eq_Char$Char = (x, y) => x === y;

const Eq_Bool$Bool = (x, y) => x === y;

const _eq = (Eq) => (x, y) => Eq(x, y);

const Ord_Int$Int = (x, y) => x < y;
const Ord_Float$Float = (x, y) => x < y;
const Ord_String$String = (x, y) => x < y;
