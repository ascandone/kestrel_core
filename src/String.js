function String$from_int(n) {
  return n.toString();
}

function String$length(s) {
  return s.length;
}

function String$parse_int(str) {
  // Copied from https://github.com/elm/core/blob/84f38891468e8e153fc85a9b63bdafd81b24664e/src/Elm/Kernel/String.js#L278
  // I haven't got the faintest idea what this code does

  let total = 0;
  let code0 = str.charCodeAt(0);
  let start = code0 == 0x2b /* + */ || code0 == 0x2d /* - */ ? 1 : 0;

  let i = start;
  for (; i < str.length; ++i) {
    let code = str.charCodeAt(i);
    if (code < 0x30 || 0x39 < code) {
      return Option$None;
    }

    total = 10 * total + code - 0x30;
  }

  return i == start ? Option$None : Option$Some(code0 == 0x2d ? -total : total);
}

function String$split(src, splitWith) {
  const str = src.split(splitWith);
  return str.reduceRight((acc, str) => List$Cons(str, acc), List$Nil);
}

function String$cons(ch, str) {
  return ch + str;
}

function String$from_char(ch) {
  return String$cons(ch, "");
}
