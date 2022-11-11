export const isArray = (val: unknown): val is any[] => {
  return Object.prototype.toString.call(val) === '[object Array]';
};
