const pachongurlselecarray = [
    {
        url: `https://www.ifanr.com/feed`,
        selector:
            "article.o-single-content__body__content.c-article-content.s-single-article.js-article",
        imglazyattr: "src",
    },
    {
        url: `https://www.pingwest.com/feed`,
        selector: "article.article-style",
        imglazyattr: "src",
    },
    {
        url: `https://www.landiannews.com/feed`,
        selector: "#scroll > section > article > div.content_post",
        imglazyattr: "src",
    },

    {
        url: `https://www.tmtpost.com/rss`,
        selector: "body > div.container > section > div > article",
        imglazyattr: "src",
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
        imglazyattr: "data-original",
    },
];
exports.pachongurlselecarray = pachongurlselecarray;
