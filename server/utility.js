
const randString = () => {
    const len = 8;
    let randStr = '';
    for (let i = 0; i < len; i++) {
        randStr += (Math.floor(Math.random() * 10) + 1).toString();
    }
    return randStr;
}

module.exports = { randString };