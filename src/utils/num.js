/**
 * 格式化数字，保留整数部分，小数部分保留一位
 * @param {number} num
 * @returns {number} 格式化后的数字
 */
export function formatNumber(num) {
  if (Number.isInteger(num)) {
    return Math.round(num);
  }
  else {
    return Number(num.toFixed(1));
  }
}

/**
 * 生成指定范围内的随机整数
 * @param {number | string} min 最小值
 * @param {number | string} max 最大值
 * @returns {number} 随机整数
 */
export function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * 生成指定范围内的随机数
 * @param {number} min 最小值
 * @param {number} max 最大值
 * @returns {number} 随机数
 */
export function generateRandomNumber(min, max) {
  // 生成指定区间内的随机数
  const randomNumber = Math.random() * (max - min) + min;
  // 将随机数精确到后一位
  const roundedNumber = Math.round(randomNumber * 10) / 10;
  return roundedNumber;
}

/**
 * 获取最近天数
 * @date 2023-08-25
 * @param {number} [num] - 获取的天数，默认为6天
 * @param {string} [g] - 日期格式，支持以下格式:
 *  - 'MM-dd' (例如 '07-17')
 *  - 'dd-MM' (例如 '17-07')
 *  - 'yyyy-MM-dd' (例如 '2023-07-17')
 *  - 'yyyy/dd/MM' (例如 '2023/17/07')
 * @returns {string[]} 返回最近天数的日期数组
 */
export function getDays(num = 6, g = 'MM-dd') {
  // eslint-disable-next-line no-undef
  const now = useNow(); //  vueuse => useNow
  const recentDates = [];

  for (let i = num - 1; i >= 0; i--) {
    const date = new Date(now.value);
    date.setDate(date.getDate() - i);

    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    const formattedDate = g === 'MM-dd' ? `${month}-${day}` : `${day}-${month}`;
    recentDates.push(formattedDate);
  }
  return recentDates;
}
