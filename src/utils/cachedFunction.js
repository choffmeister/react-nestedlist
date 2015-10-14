/**
 * Returns a new function, that caches the last return value.
 * The cached value is return, if all arguments are the _SAME_.
 */
export default function cachedFunction(fn) {
  let cachedArgs = [];
  let cachedResult = undefined;

  return function (...args) {
    if (args.length === cachedArgs.length && args.every((a, i) => cachedArgs[i] === a)) {
      return cachedResult;
    } else {
      cachedArgs = args;
      cachedResult = fn.apply(this, args);
      return cachedResult;
    }
  };
}
