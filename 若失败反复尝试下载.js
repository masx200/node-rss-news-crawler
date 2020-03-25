const { sleeptiemout } = require("./sleeptiemout");
const { fetch,  } = require("./index");
/**
 * @param {string} url
 */

async function 若失败反复尝试下载(url) {
    // var url = url;
    return await new Promise(async (rs) => {
        console.log("爬虫开始下载", url);
        /**
         * @param {string} body
         */
        const responsecall = async (body) => {
            // try {
            // if (error)
            //     throw new Error(error);
            // if (typeof meta.status !== `undefined` && meta.status !== 200) {
            //     /* TypeError: Cannot read property 'status' of undefined */
            //     //   console.log("爬虫下载失败", url);
            //     throw new Error("爬虫下载失败" + " 错误码 " + meta.status);
            //     //   return;
            // }
            rs(body);
            return;
            // } catch (error) {
            //     // console.error("爬虫下载失败", url, error);
            //     // await sleeptiemout(500 + 500 * Math.random());
            //     // rs(await 若失败反复尝试下载(url));
            // }
        };

        try {
            const response = await fetch(url, urloptions);

            if (!response.ok) {
                throw new Error(
                    "爬虫下载失败,重新下载-" + url + "错误码:" + response.status
                );
            }
            const bodytext = await response.text();

            responsecall(bodytext);
        }
        catch (e) {
            console.error("爬虫下载失败", url, e);
            await sleeptiemout(500 + 500 * Math.random());

            rs(await 若失败反复尝试下载(url));
        }
    });
}
exports.若失败反复尝试下载 = 若失败反复尝试下载;
