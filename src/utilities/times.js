const units = [
  {duration: 1000000000n, name: "s"},
  {duration: 1000000n, name: "ms"},
  {duration: 1000n, name: "\u03BCs"},
  {duration: 1, name: "ns"}
];

export function hrformat(ns) {
  for(const unit of units) {
    if(ns < unit.duration)
      continue;

    return `${ns / unit.duration}${unit.name}`;
  }

  return "Instantly";
}
