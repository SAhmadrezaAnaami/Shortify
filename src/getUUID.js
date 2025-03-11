const {v4} = require("uuid")
function getUUID() {
    return v4();
}

module.exports = {
    getUUID
}