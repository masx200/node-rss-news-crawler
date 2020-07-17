const cheerio = require("cheerio");
const path = require("path");
const { 数组去重 } = require("./数组去重");
const { formatfilepath } = require("./formatfilepath");
const { sleeptiemout } = require("./sleeptiemout");
const { 若失败反复尝试下载 } = require("./若失败反复尝试下载");
const { filecreatetime, fsPromises } = require("./index");
exports.default = 爬虫下载解析;
async function 爬虫下载解析(url, contentselector, imglazyattr, websitetitle) {
    await sleeptiemout(100 * Math.random());
    return await new Promise(async (rs, rj) => {
        const selector = contentselector;
        const body = await 若失败反复尝试下载(url);
        const $ = cheerio.load(body.toString());
        const imgs = 数组去重(
            Array.from($(selector + " img")).map((e) => {
                return e.attribs[imglazyattr] || e.attribs["src"];
            })
        );
        const title = $("title").text();
        const contenttext = $(contentselector).text();
        const filepath = path.join(
            __dirname,
            "download",
            formatfilepath(
                websitetitle + "-" + title + "-" + filecreatetime + ".json"
            )
        );
        const content = contenttext
            .trim()
            .replace(/\n/g, "")
            .replace(/\ /g, "");
        const writetext = {
            title: title,
            url: url,
            imgs,
            content: content,
        };
        console.log("写入到文件", filepath, writetext);
        await fsPromises.writeFile(filepath, JSON.stringify(writetext));
        rs(["文件写入成功!", url, filepath]);
    });
}
