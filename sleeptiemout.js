/**
 * @param {number} timems
 */

async function sleeptiemout(timems) {
    return await new Promise((rs) => {
        setTimeout(() => {
            rs();
        }, timems);
    });
}
exports.sleeptiemout = sleeptiemout;
