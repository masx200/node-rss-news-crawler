"use strict";
const process = require("process");
process.on("unhandledRejection", (err) => {
    throw err;
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
~(async () => {
    if (!fs.existsSync(path.join(__dirname, "download"))) {
        console.log(
            "所需的目录不存在,创建目录",
            path.join(__dirname, "download")
        );
        fs.mkdirSync(path.join(__dirname, "download"));
    }
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
})();
