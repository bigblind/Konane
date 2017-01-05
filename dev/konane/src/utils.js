export const flatmap = (arr, f) => Array.prototype.concat.apply([], arr.map(f));

export const inRange = (a, b, c) => a >= b && a <= c;