const urloptions = require("./urloptions").default;
const check = require("check-types");
const fastxmlparser = require("fast-xml-parser");
const fs = require("fs");
const path = require("path");
const { formatfilepath } = require("./formatfilepath");
const { filecreatetime, fetch } = require("./index");
const 爬虫下载解析 = require("./爬虫下载解析").default;
async function 获取rss订阅内容(url, selector, imglazyattr) {
  return await new Promise(async (rs, rj) => {
    console.log("爬虫测试开始", url);
    const responsecall = async (body) => {
      const htmltext = body.toString();
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
      const resultoutput = jsondata.rss.channel.item.map((eleobj) => {
        return {
          title: eleobj.title,
          link: eleobj.link,
        };
      });
      var filelists = await Promise.all(
        resultoutput.map((e) =>
          爬虫下载解析(e.link, selector, imglazyattr, websitetitle)
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
