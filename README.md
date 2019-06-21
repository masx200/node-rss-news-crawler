# nodejs_pachong_test

使用 javascript 写的 nodejs 爬虫,从 rss 订阅上下载 xml,转换成 json,然后提取里面的每一个订阅项目的 url,并爬取正文内容和图片的网址


使用的模块如下

```javascript

const fs = require("fs");
const path = require("path");
const fastxmlparser = require("fast-xml-parser");
const cheerio = require("cheerio");
const fetch = require("fetch");
```

爬取的结果如下

```json
{
  "title": "Python 3.7 上架 Win10 应用商店，可简单一键安装运行开发环境了 - 异次元软件下载",
  "link": "https://www.iplaysoft.com/p/python3-windows",
  "meta": {
    "status": 200,
    "responseHeaders": {
      "server": "nginx",
      "date": "Fri, 21 Jun 2019 11:26:26 GMT",
      "content-type": "text/html; charset=UTF-8",
      "transfer-encoding": "chunked",
      "connection": "close",
      "x-powered-by": "PHP/7.3.6",
      "x-hyper-cache": "stop - no cache header, gzip on the fly",
      "link": "<https://www.iplaysoft.com/wp-json/>; rel=\"https://api.w.org/\", <https://www.iplaysoft.com/?p=4756>; rel=shortlink",
      "cache-control": "private, max-age=0, no-cache, no-transform",
      "vary": "Accept-Encoding,User-Agent",
      "content-encoding": "gzip",
      "x-frame-options": "SAMEORIGIN",
      "x-xss-protection": "1"
    },
    "finalUrl": "https://www.iplaysoft.com/p/python3-windows",
    "redirectCount": 0,
    "cookieJar": { "options": { "sessionTimeout": 1800 }, "cookies": {} }
  },
  "imgs": [
    "https://img.iplaysoft.com/wp-content/uploads/2019/p/python3-windows/python.jpg",
    "https://img.iplaysoft.com/wp-content/uploads/2019/p/python3-windows/python_old.png",
    "https://img.iplaysoft.com/wp-content/uploads/2019/p/python3-windows/python_3.png"
  ],
  "text": "Windows 10 最近在开源界是不断的发力，新版系统不仅可以让用户安装各种 Linux 子系统，比如 Ubuntu 等，而且微软还特意开发了全新的 Windows Terminal 命令行工具。而今，作为火热的编程开发语言之一的 Python 在团队和开源社区的帮助下，Windows 10 的五月更新为 Microsoft Store 应用商店带来了 Python 3.7。用户可以直接在商店里一键下载安装 Python 的开发和运行环境。    这将大大降低了用户在 Windows 上搭建 Python 开发环境的时间成本以及学习成本。一直以来，Windows 是唯一一款不包含开箱即用的 Python 解释器的主流操作系统。macOS 和 Linux 都默认自带了 Python。对于不需要它的用户而言，这有助于减少操作系统的磁盘空间占用，并在一定程度上提升安全性。但对于需要它的人来说，Python 的缺失对其产生了深刻的影响。▲ 在旧版本的 Windows 中使用 Python当然，我们有许多途径去获取 Python，比如前往 Python.org 官网下载安装程序、采用 Anaconda 这样的发行版、甚至安装庞大的 Visual Studio 集成开发环境。但是，应该下载哪个版本？安装完成后如何访问？怎样设置？你或许可以快速找到需要的更多答案，但实际体验可能非常繁琐。对于希望入门 Python 的初学者，搭建开发环境如果过于繁琐其实十分不友好。Windows 10 的五月更新十分体贴地解决了这个痛点：如果已经安装了 Windows 10 2019 五月更新，可以直接在搜索框中输入 Python 或 Python 3 。若系统未安装 Python，Windows 10 会直接跳转到 Microsoft Store。若已经安装 Python，Windows 10 会打开命令提示符。Python 的一些常用命令，诸如 python, pip 和 idle 等都是全平台保持一致的，在 Mac、Linux 上的使用和 Windows 的一样。相关文件下载地址官方网站：访问\n软件性质：免费下载 Python 3 (Win10应用商店)  |  更多微软相关  |  更多开发相关"
}
```
