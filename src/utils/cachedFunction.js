/**
 * Returns a new function, that caches the last return value.
 * The cached value is return, if all arguments are the _SAME_.
 */
export default function cachedFunction(fn) {
  let cached = false;
  let cachedArgs = [];
  let cachedResult = undefined;

  return function (...args) {
    if (cached && args.length === cachedArgs.length && args.every((a, i) => cachedArgs[i] === a)) {
      return cachedResult;
    } else {
      cached = true;
      cachedArgs = args;
      cachedResult = fn.apply(this, args);
      return cachedResult;
    }
  };
}
