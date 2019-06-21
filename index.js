const fastxmlparser = require("fast-xml-parser");
const cheerio = require("cheerio");
const fetch = require("fetch");
const navigatoruserAgent =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/75.0.3770.100 Safari/537.36";
const urloptions = {
  headers: {
    "User-Agent": navigatoruserAgent
  }
};
const fs = require("fs");
const path = require("path");
/* 获取懒加载的图片的网址 */
/* <img class="aligncenter size-medium lazyloaded" data-src="https://img.iplaysoft.com/wp-content/uploads/2019/imageassistant/imageassistant_filter.jpg" data-srcset="https://img.iplaysoft.com/wp-content/uploads/2019/imageassistant/imageassistant_filter.jpg 1x,https://img.iplaysoft.com/wp-content/uploads/2019/imageassistant/imageassistant_filter_2x.jpg 2x" alt="图片助手筛选" data-width="680" data-height="704" loading="lazy" width="680" height="704" srcset="https://img.iplaysoft.com/wp-content/uploads/2019/imageassistant/imageassistant_filter.jpg 1x,https://img.iplaysoft.com/wp-content/uploads/2019/imageassistant/imageassistant_filter_2x.jpg 2x" src="https://img.iplaysoft.com/wp-content/uploads/2019/imageassistant/imageassistant_filter.jpg"> */

/* <img src="https://img.ithome.com/newsuploadfiles/2019/6/20190621_171032_868.php@wm_1,k_aW1nL3FkLnBuZw==,y_20,o_100,x_20,g_7" w="600" h="337" class="lazy" title="在exFAT分区中安装并启动Windows系统教程" data-original="https://img.ithome.com/newsuploadfiles/2019/6/20190621_171032_868.php@wm_1,k_aW1nL3FkLnBuZw==,y_20,o_100,x_20,g_7" width="600" height="337" style="display: inline;"> */
const pachongurlselecarray = [
  {
    url: "https://feed.iplaysoft.com/",
    selector: ".entry-content",
    imglazyattr: "data-src"
  },
  {
    url: "https://www.ithome.com/rss/",
    selector: "#paragraph",
    imglazyattr: "data-original"
  }
];
pachongurlselecarray.forEach(e =>
  获取rss订阅内容(e.url, e.selector, e.imglazyattr)
);
async function 获取rss订阅内容(feedrssurl, selector, imglazyattr) {
  console.log("爬虫测试开始", feedrssurl);

  fetch.fetchUrl(feedrssurl, urloptions, async (error, meta, body) => {
    if (meta.status !== 200) {
      throw new Error("爬虫下载失败,重新下载", feedrssurl);
      return;
    }
    const htmltext = body.toString();
    //   console.log(htmltext);
    const jsondata = fastxmlparser.parse(htmltext);
    //   console.log(jsondata.rss.channel.item);
    const resultoutput = jsondata.rss.channel.item.map(eleobj => {
      return {
        title: eleobj.title,
        link: eleobj.link
      };
    });

    console.log(resultoutput);
    //   console.log(meta);
    resultoutput.forEach(e => 爬虫下载解析(e.link, selector, imglazyattr));
  });
}

async function 爬虫下载解析(elinkurl, contentselector, imglazyattr) {
  const selector = contentselector;
  setTimeout(() => {
    console.log("爬虫开始下载", elinkurl);
    fetch.fetchUrl(elinkurl, urloptions, (error, meta, body) => {
      //   console.log(meta);
      /* {"status":503,"responseHeaders":{"server":"nginx","date":"Fri, 21 Jun 2019 09:07:25 GMT","content-type":"text/html; charset=utf-8","content-length":"18540","connection":"close","etag":"\"5c836af2-486c\""},"finalUrl":"https://www.iplaysoft.com/ios-beta.html","redirectCount":0,"cookieJar":{"options":{"sessionTimeout":1800},"cookies":{}}} */
      /* 对不起，目前服务器繁忙，或者你当前的 IP 被限制了，请稍后再重试。如果你经常看到这个页面，请联系站长解决，谢谢！ */

      if (meta.status !== 200) {
        console.log("爬虫下载失败", elinkurl);
        setTimeout(() => {
          爬虫下载解析(elinkurl, contentselector, imglazyattr);
        }, 200 + 300 * Math.random());
        return;
      }
      const $ = cheerio.load(body.toString());
      const imgs = Array.from($(selector + " img")).map(
        e => {
          //   console.log(e);
          return e.attribs[imglazyattr] || e.attribs["src"];
        }
        //   $(e).attr('data-original')
      );
      const title = $("title").text();
      const contenttext = $(contentselector).text();
      const filetextobj = { title, link: elinkurl, contenttext };
      //   console.log(filetextobj);
      var filepath = path.join(
        __dirname,
        "download",
        (title + new Date().toString() + ".json")
          .replace(/:/g, " ")
          .replace(/\\/g, " ")
          .replace(/\//g, " ")
      );
      const writetext = {
        title: filetextobj.title,

        link: filetextobj.link,
        meta,
        imgs,
        text: filetextobj.contenttext
      };

      /* 判断文件目录是否存在 */
      if (!fs.existsSync(path.join(__dirname, "download"))) {
        console.log(
          "所需的目录不存在,创建目录",
          path.join(__dirname, "download")
        );
        fs.mkdirSync(path.join(__dirname, "download"));
      }
      console.log("写入到文件", filepath, writetext);
      //   console.log("./download/" + title + new Date().getTime() + ".json");
      fs.writeFile(
        filepath,
        //   "./download/" + title + new Date().getTime() + ".json",
        JSON.stringify(writetext),
        // JSON.stringify(meta) +
        //   "\n" +
        //   //   body.toString() +
        //   "\n" +
        //   JSON.stringify(filetextobj),
        e => {
          if (e) console.error(e);
        }
        /* [Error: ENOENT: no such file or directory, open 'D:\Documents\nodejs爬虫测试\download\壹伴 - 最佳微信公众号排版编辑器工具！(支持Markdown\图文采集\数据分析) - 异次元软件下载Fri Jun 21 2019 19:04:27 GMT+0800 (GMT+08:00).json'] {
  errno: -4058,
  code: 'ENOENT',
  syscall: 'open',
  path: 'D:\\Documents\\nodejs爬虫测试\\download\\壹伴 - ' +
    '最佳微信公众号排版编辑器工具！(支持Markdown\\图文采集\\数据分析) - 异次元软件下载Fri Jun 21 2019 ' +
    '19:04:27 GMT+0800 (GMT+08:00).json'
} */
      );
    });
  }, 100 * Math.random());
}
