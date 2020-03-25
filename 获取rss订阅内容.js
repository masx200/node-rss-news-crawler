const urloptions = require("./urloptions").default;
const check = require("check-types");
const fastxmlparser = require("fast-xml-parser");
const fs = require("fs");
const path = require("path");
const { formatfilepath } = require("./formatfilepath");
const { filecreatetime, fetch } = require("./index");

const 爬虫下载解析 = require("./爬虫下载解析").default;
/**
 * @param {string} url
 * @param {string} selector
 * @param {string} imglazyattr
 */

async function 获取rss订阅内容(url, selector, imglazyattr) {
    return await new Promise(async (rs, rj) => {
        console.log("爬虫测试开始", url);

        /**
         * @param {string} body
         */
        const responsecall = async (body) => {
            // if (error) {
            //     rj(new Error(error));
            //     return;
            // }
            // if (typeof meta.status !== `undefined` && meta.status !== 200) {
            //     /* TypeError: Cannot read property 'status' of undefined */
            //     // console.error
            //     rj(
            //         new Error(
            //             "爬虫下载失败,重新下载-" +
            //                 url +
            //                 "错误码" +
            //                 meta.status
            //         )
            //     );
            //     return;
            // }
            const htmltext = body.toString();
            //   console.log(htmltext);
            const jsondata = fastxmlparser.parse(htmltext);

            check.assert.nonEmptyObject(jsondata);
            const websitetitle = jsondata.rss.channel.title;

            const rssfilepath = path.join(
                __dirname,
                "download",
                formatfilepath(
                    websitetitle + "-" + url + "-" + filecreatetime + ".json"
                )
            );
            fs.writeFile(rssfilepath, JSON.stringify(jsondata), (e) => {
                if (e) {
                    rj(e);
                    return;
                }
            });
            //   console.log(jsondata.rss.channel.item);
            const resultoutput = jsondata.rss.channel.item.map(
                /**
                 * @param {{ title: any; link: any; }} eleobj
                 */
                (eleobj) => {
                    return {
                        title: eleobj.title,
                        link: eleobj.link,
                    };
                }
            );

            // console.log(resultoutput);
            //   console.log(meta);
            var filelists = await Promise.all(
                resultoutput.map(
                    /**
                     * @param {{ link: string; }} e
                     */
                    (e) =>
                        爬虫下载解析(
                            e.link,
                            selector,
                            imglazyattr,
                            websitetitle
                        )
                )
            );
            rs(["爬虫完成! ", url, filelists]);
        };
        const response = await fetch(url, urloptions);

        if (!response.ok) {
            throw new Error(
                "爬虫下载失败,重新下载-" + url + "错误码:" + response.status
            );
        }
        const bodytext = await response.text();
        responsecall(bodytext);
    });
}
exports.获取rss订阅内容 = 获取rss订阅内容;
