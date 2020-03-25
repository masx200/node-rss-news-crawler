const navigatoruserAgent = require("./navigatoruserAgent").default;
const urloptions = {
    headers: {
        "User-Agent": navigatoruserAgent,
    },
};
exports.default = urloptions;
