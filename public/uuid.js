const rnd16 = function () {
  return Math.floor((1 + Math.random()) * 0x10000)
    .toString(16)
    .substring(1);
};

export default function uuid() {
  return rnd16() + rnd16() + '-' +
    rnd16() + '-' +
    rnd16() + '-' +
    rnd16() + '-' +
    rnd16() + rnd16() + rnd16();
}
