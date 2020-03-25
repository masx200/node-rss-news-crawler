const cheerio = require("cheerio");
const path = require("path");
const { 数组去重 } = require("./数组去重");
const { formatfilepath } = require("./formatfilepath");
const { sleeptiemout } = require("./sleeptiemout");
const { 若失败反复尝试下载 } = require("./若失败反复尝试下载");
const { filecreatetime, fsPromises } = require("./index");
/**
 * @param {string} url
 * @param {string} contentselector
 * @param {string} imglazyattr
 * @param {string} websitetitle
 */

async function 爬虫下载解析(url, contentselector, imglazyattr, websitetitle) {
    await sleeptiemout(100 * Math.random());
    return await new Promise(async (rs, rj) => {
        const selector = contentselector;
        // setTimeout(() => {
        const body = await 若失败反复尝试下载(url);

        const $ = cheerio.load(body.toString());
        const imgs = 数组去重(
            Array.from($(selector + " img")).map(
                (e) => {
                    //   console.log(e);
                    return e.attribs[imglazyattr] || e.attribs["src"];
                }
                //   $(e).attr('data-original')
            )
        );
        const title = $("title").text();
        const contenttext = $(contentselector).text();
        // const filetextobj = { title, link: url, contenttext };
        //   console.log(filetextobj);
        const filepath = path.join(
            __dirname,
            "download",
            formatfilepath(
                websitetitle + "-" + title + "-" + filecreatetime + ".json"
            )
        );
        /* 把回车和空格都删掉 */
        const content = contenttext
            .trim()
            .replace(/\n/g, "")
            .replace(/\ /g, "");
        const writetext = {
            title: title,

            url: url,
            //   meta,
            imgs,
            content: content
        };

        /* 判断文件目录是否存在 */
        console.log("写入到文件", filepath, writetext);
        await fsPromises.writeFile(filepath, JSON.stringify(writetext));
        rs(["文件写入成功!", url, filepath]);
        //   console.log("./download/" + title + new Date().getTime() + ".json");
        // try {
        //     await fsPromises.writeFile(filepath, JSON.stringify(writetext));
        //     rs(["文件写入成功!", url, filepath]);
        // } catch (error) {
        //     rj(new Error(error));
        // }
        // fs.writeFile(
        //   filepath,
        //   //   "./download/" + title + new Date().getTime() + ".json",
        //   JSON.stringify(writetext),
        //   // JSON.stringify(meta) +
        //   //   "\n" +
        //   //   //   body.toString() +
        //   //   "\n" +
        //   //   JSON.stringify(filetextobj),
        //   e => {
        //     if (e) {
        //       rj(new Error(e));
        //     }
        //   }
        // );
    });

    // }, 100 * Math.random());
    //   });
}
