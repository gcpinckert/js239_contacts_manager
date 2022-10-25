export default (fn, delay) => {
  let timeout;
  return (...args) => {
    if (timeout) { clearTimeout(timeout) }
    timeout = setTimeout(() => fn.apply(null, args), delay);
  };
}