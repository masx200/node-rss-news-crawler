/**
 * @param {string} str
 */
function formatfilepath(str) {
    return str
        .replace(/\"/g, "_")
        .replace(/\ /g, "_")
        .replace(/:/g, "_")
        .replace(/\\/g, "_")
        .replace(/\//g, "_")
        .replace(/\|/g, "_");
}
exports.formatfilepath = formatfilepath;
