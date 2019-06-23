"use strict";
process.on("unhandledRejection", err => {
  throw err;
  //   console.error(err); //err;
});
const filecreatetime = new Date().toString();
const fastxmlparser = require("fast-xml-parser");
const cheerio = require("cheerio");
const fetch = require("fetch");
const fs = require("fs");
const fsPromises = fs.promises;
const path = require("path");
const navigatoruserAgent =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/75.0.3770.100 Safari/537.36";
const urloptions = {
  headers: {
    "User-Agent": navigatoruserAgent
  }
};

const pachongurlselecarray = [
  {
    url: `https://www.ifanr.com/feed`,
    selector:
      "article.o-single-content__body__content.c-article-content.s-single-article.js-article",
    imglazyattr: "src"
  },
  {
    url: `https://www.pingwest.com/feed`,
    selector: "article.article-style",
    imglazyattr: "src"
  },
  {
    url: `https://www.landiannews.com/feed`,
    selector: "#scroll > section > article > div.content_post",
    imglazyattr: "src"
  },

  {
    url: `https://www.tmtpost.com/rss`,
    selector: "body > div.container > section > div > article",
    imglazyattr: "src"
  },
  /* 
  本页面禁止访问 - 错误：403
“ 或者你的 IP 由于访问过于频繁受限制了 ”
错误的原因：

1、本页面被管理员设置为 “禁止访问”。

2、系统检测到你的 IP 有“疑似机器攻击”的频繁刷新请求，并进行拦截。

3、如你打开本站任何页面都是出现此错误，则表明你的 IP 已被封禁。

但如果你「认为这是误判」，请邮件联系站长，并告知你的 IP 和使用的浏览器，我们会尽快给你解封，谢谢！

站长微博 邮件联系
如果你对此有任何问题，请联系站长。 
联系邮箱：xtremforce在谷歌gmail点com

— 异次元软件世界 iPlaySoft.com

关注我们的 @XForce 新浪微博。 */
  /* {
    url: "https://feed.iplaysoft.com/",
    selector: " div.entry-content",
    imglazyattr: "data-src"
  }, */
  {
    url: "https://www.ithome.com/rss/",
    selector: "div#paragraph.post_content",
    imglazyattr: "data-original"
  }
];
(async () => {
  /* 先删除旧的json文件吧 */
  const oldfiles = await fsPromises.readdir(path.join(__dirname, "download"));
  var output = await Promise.all([
    Promise.all(
      pachongurlselecarray.map(e =>
        获取rss订阅内容(e.url, e.selector, e.imglazyattr)
      )
    ),

    Promise.all(
      oldfiles.map(f => {
        return fsPromises.unlink(path.join(__dirname, "download", f));
      })
    )
  ]);

  console.log("爬虫全部完成!\n");
  console.log(JSON.stringify(output[0]));
  const filepath = path.join(
    __dirname,
    "download",
    `download ${new Date()}.log.json`
      .replace(/\"/g, "_")
      .replace(/\|/g, "_")
      .replace(/:/g, "_")
      .replace(/\\/g, "_")
      .replace(/\//g, "_")
      .replace(/\ /g, "_")
  );
  try {
    await fsPromises.writeFile(filepath, JSON.stringify(output[0]));
  } catch (error) {
    console.error(error);
  }

  //  );
})();
async function sleeptiemout(timems) {
  return await new Promise(rs => {
    setTimeout(() => {
      rs();
    }, timems);
  });
}
async function 获取rss订阅内容(feedrssurl, selector, imglazyattr) {
  return await new Promise(async (rs, rj) => {
    console.log("爬虫测试开始", feedrssurl);

    fetch.fetchUrl(feedrssurl, urloptions, async (error, meta, body) => {
      if (error) {
        rj(new Error(error));
        return;
      }
      if (typeof meta.status !== `undefined` && meta.status !== 200) {
        /* TypeError: Cannot read property 'status' of undefined */
        // console.error
        rj(
          new Error(
            "爬虫下载失败,重新下载-" + feedrssurl + "错误码" + meta.status
          )
        );
        return;
      }
      const htmltext = body.toString();
      //   console.log(htmltext);
      const jsondata = fastxmlparser.parse(htmltext);
      const websitetitle = jsondata.rss.channel.title;

      const rssfilepath = path.join(
        __dirname,
        "download",
        (websitetitle + "-" + feedrssurl + "-" + filecreatetime + ".json")
          .replace(/\"/g, "_")
          .replace(/\|/g, "_")
          .replace(/:/g, "_")
          .replace(/\\/g, "_")
          .replace(/\//g, "_")
          .replace(/\ /g, "_")
      );
      fs.writeFile(rssfilepath, JSON.stringify(jsondata), e => {
        if (e) {
          rj(new Error(e));
        }
      });
      //   console.log(jsondata.rss.channel.item);
      const resultoutput = jsondata.rss.channel.item.map(eleobj => {
        return {
          title: eleobj.title,
          link: eleobj.link
        };
      });

      // console.log(resultoutput);
      //   console.log(meta);
      var filelists = await Promise.all(
        resultoutput.map(e =>
          爬虫下载解析(e.link, selector, imglazyattr, websitetitle)
        )
      );
      rs(
        ["爬虫完成! ", feedrssurl, filelists]
        // + feedrssurl + " " + JSON.stringify(filelists)
      );
    });
  });
}
async function 若失败反复尝试下载(url) {
  var elinkurl = url;
  return await new Promise(async rs => {
    console.log("爬虫开始下载", elinkurl);
    fetch.fetchUrl(elinkurl, urloptions, async (error, meta, body) => {
      try {
        if (error) throw new Error(error);

        if (typeof meta.status !== `undefined` && meta.status !== 200) {
          /* TypeError: Cannot read property 'status' of undefined */
          //   console.log("爬虫下载失败", elinkurl);
          throw new Error("爬虫下载失败" + " 错误码 " + meta.status);

          //   return;
        }

        rs(body);
        return;
      } catch (error) {
        console.error("爬虫下载失败", elinkurl, error);
        await sleeptiemout(500 + 500 * Math.random());

        rs(await 若失败反复尝试下载(url));
      }
    });
  });
}

async function 爬虫下载解析(
  elinkurl,
  contentselector,
  imglazyattr,
  websitetitle
) {
  await sleeptiemout(100 * Math.random());
  return await new Promise(async (rs, rj) => {
    const selector = contentselector;
    // setTimeout(() => {

    var body = await new Promise(async (resolve, reject) => {
      resolve(await 若失败反复尝试下载(elinkurl));
    });

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
    const filepath = path.join(
      __dirname,
      "download",
      (websitetitle + "-" + title + "-" + filecreatetime + ".json")
        .replace(/\"/g, "_")
        .replace(/\ /g, "_")
        .replace(/:/g, "_")
        .replace(/\\/g, "_")
        .replace(/\//g, "_")
        .replace(/\|/g, "_")
    );
    const writetext = {
      title: filetextobj.title,

      link: filetextobj.link,
      //   meta,
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
    try {
      await fsPromises.writeFile(filepath, JSON.stringify(writetext));
      rs(["文件写入成功!", elinkurl, filepath]);
    } catch (error) {
      rj(new Error(error));
    }

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
