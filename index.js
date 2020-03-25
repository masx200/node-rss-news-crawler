("use strict");
const process = require("process");

process.on("unhandledRejection", (err) => {
    throw err;
    //   console.error(err); //err;
});
const filecreatetime = new Date().toString();
exports.filecreatetime = filecreatetime;

const fetch = require("node-fetch").default;
exports.fetch = fetch;
const fs = require("fs");
const fsPromises = fs.promises;
exports.fsPromises = fsPromises;
const path = require("path");
const { pachongurlselecarray } = require("./pachongurlselecarray");
const { 获取rss订阅内容 } = require("./获取rss订阅内容");

/* 获取懒加载的图片的网址 */
/* <img class="aligncenter size-medium lazyloaded" data-src="https://img.iplaysoft.com/wp-content/uploads/2019/imageassistant/imageassistant_filter.jpg" data-srcset="https://img.iplaysoft.com/wp-content/uploads/2019/imageassistant/imageassistant_filter.jpg 1x,https://img.iplaysoft.com/wp-content/uploads/2019/imageassistant/imageassistant_filter_2x.jpg 2x" alt="图片助手筛选" data-width="680" data-height="704" loading="lazy" width="680" height="704" srcset="https://img.iplaysoft.com/wp-content/uploads/2019/imageassistant/imageassistant_filter.jpg 1x,https://img.iplaysoft.com/wp-content/uploads/2019/imageassistant/imageassistant_filter_2x.jpg 2x" src="https://img.iplaysoft.com/wp-content/uploads/2019/imageassistant/imageassistant_filter.jpg"> */

/* <img src="https://img.ithome.com/newsuploadfiles/2019/6/20190621_171032_868.php@wm_1,k_aW1nL3FkLnBuZw==,y_20,o_100,x_20,g_7" w="600" h="337" class="lazy" title="在exFAT分区中安装并启动Windows系统教程" data-original="https://img.ithome.com/newsuploadfiles/2019/6/20190621_171032_868.php@wm_1,k_aW1nL3FkLnBuZw==,y_20,o_100,x_20,g_7" width="600" height="337" style="display: inline;"> */

/* [Error: ENOENT: no such file or directory, open 'D:\Documents\nodejs爬虫测试\download\壹伴 - 最佳微信公众号排版编辑器工具！(支持Markdown\图文采集\数据分析) - 异次元软件下载Fri Jun 21 2019 19:04:27 GMT+0800 (GMT+08:00).json'] {
  errno: -4058,
  code: 'ENOENT',
  syscall: 'open',
  path: 'D:\\Documents\\nodejs爬虫测试\\download\\壹伴 - ' +
    '最佳微信公众号排版编辑器工具！(支持Markdown\\图文采集\\数据分析) - 异次元软件下载Fri Jun 21 2019 ' +
    '19:04:27 GMT+0800 (GMT+08:00).json'
} */

//   console.log(meta);
/* {"status":503,"responseHeaders":{"server":"nginx","date":"Fri, 21 Jun 2019 09:07:25 GMT","content-type":"text/html; charset=utf-8","content-length":"18540","connection":"close","etag":"\"5c836af2-486c\""},"finalUrl":"https://www.iplaysoft.com/ios-beta.html","redirectCount":0,"cookieJar":{"options":{"sessionTimeout":1800},"cookies":{}}} */
/* 对不起，目前服务器繁忙，或者你当前的 IP 被限制了，请稍后再重试。如果你经常看到这个页面，请联系站长解决，谢谢！ */
~(async () => {
    if (!fs.existsSync(path.join(__dirname, "download"))) {
        console.log(
            "所需的目录不存在,创建目录",
            path.join(__dirname, "download")
        );
        fs.mkdirSync(path.join(__dirname, "download"));
    }
    /* 先删除旧的json文件吧 */
    const oldfiles = await fsPromises.readdir(path.join(__dirname, "download"));
    await Promise.all(
        oldfiles.map((f) => {
            return fsPromises.unlink(path.join(__dirname, "download", f));
        })
    );
    var output = await Promise.all(
        pachongurlselecarray.map((e) =>
            获取rss订阅内容(e.url, e.selector, e.imglazyattr)
        )
    );

    console.log("爬虫全部完成!\n");
    console.log(JSON.stringify(output));
    // const filepath = path.join(
    //     __dirname,
    //     "download",
    //     `download ${new Date()}.log.json`
    //         .replace(/\"/g, "_")
    //         .replace(/\|/g, "_")
    //         .replace(/:/g, "_")
    //         .replace(/\\/g, "_")
    //         .replace(/\//g, "_")
    //         .replace(/\ /g, "_")
    // );
    // try {
    //     await fsPromises.writeFile(filepath, JSON.stringify(output[0]));
    // } catch (error) {
    //     console.error(error);
    // }

    //  );
})();
