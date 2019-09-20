/**
 * @author William Cui
 * @description 防抖函数
 * @param fn {function} 函数
 * @param wait {number} 毫秒时间
 * @returns void
 */
export function debounce(fn, wait) {
  var timeout = null;
  return function() {
    if (timeout !== null) clearTimeout(timeout);
    timeout = setTimeout(fn, wait);
  };
}

/**
 * @author William Cui
 * @description 节流函数
 * @param fn {function} 函数
 * @param delay {number} 毫秒时间
 * @returns void
 */
export function throttle(fn, delay) {
  var timer = null;
  return function() {
    var context = this;
    var args = arguments;
    if (!timer) {
      timer = setTimeout(function() {
        fn.apply(context, args);
        timer = null;
      }, delay);
    }
  };
}
