
/**
 * Generate a random string of 8 characters
 * @returns {String} The random string
 */
const randString = () => {
    const len = 8;
    let randStr = '';
    for (let i = 0; i < len; i++) {
        randStr += (Math.floor(Math.random() * 10) + 1).toString();
    }
    return randStr;
}

const percentile = (arr, val) =>
  (100 *
    arr.reduce(
      (acc, v) => acc + (v < val ? 1 : 0) + (v === val ? 0.5 : 0),
      0
    )) /
  arr.length;

module.exports = { randString, percentile };