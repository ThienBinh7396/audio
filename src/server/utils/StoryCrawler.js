const Helper = require("./Helper");
const request = require("request");
const cheerio = require("cheerio");

const axios = require("axios");

const Wikidich = "Wikidich";
const TangThuVien = "Tangthuvien";
const TruyenCv = "Truyencv";

const mapWebsiteWithRequiredNode = {
  [Wikidich]: {
    domainRegex: /wikidich/gi,
    storyUrl: ".top-title a:first-child",
    contentNode: "#bookContentBody",
    storyTitle: ".book-title:nth-child(1)",
    chapterTitle: ".book-title:nth-child(2)",
    currentChapterIndex: {
      query: ".top-title a.chapter-name",
      regex: /\s(?<index>\d+)/
    },
    authorTitle: ".book-title:nth-child(3)",
    nextChapter: {
      hasNode: true,
      type: "link",
      query: ".btn-bot:nth-child(3)",
    },
    prevChapter: {
      hasNode: true,
      type: "link",
      query: ".btn-bot:nth-child(1)",
    },
  },
  [TangThuVien]: {
    domainRegex: /tangthuvien/gi,
    storyUrl: ".truyen-title a",
    contentNode: ".box-chap",
    storyTitle: ".truyen-title",
    chapterTitle: ".chapter h2",
    currentChapterIndex: {
      query: ".chapter h2",
      regex: /\s(?<index>\d+)/
    },
    authorTitle: ".chapter p",
    nextChapter: {
      hasNode: false,
      type: "link",
      query: null,
      next: currentUrl => currentUrl.replace(/-(\d+)/, (match, string, offset) =>
        match.slice(0, match.length - string.length) + (Number(string) + 1)
      ),
    },
    prevChapter: {
      hasNode: false,
      type: "link",
      query: null,
      prev: currentUrl => currentUrl.replace(/-(\d+)/, (match, string, offset) =>
        match.slice(0, match.length - string.length) + (Number(string) - 1)
      ),
    },
  },
  [TruyenCv]: {
    domainRegex: /metruyenchu/gi,
    storyUrl: "#js-read__body ul li:nth-child(1) a",
    contentNode: "#js-read__content",
    storyTitle: "h1",
    chapterTitle: ".nh-read__title",
    currentChapterIndex: {
      query: "head title",
      regex: /\s(?<index>\d+)/
    },
    authorTitle: "#js-read__body ul li:nth-child(2)",
    nextChapter: {
      hasNode: false,
      type: "link",
      query: null,
      next: currentUrl => currentUrl.replace(/-(\d+)/, (match, string, offset) =>
        match.slice(0, match.length - string.length) + (Number(string) + 1)
      ),
    },
    prevChapter: {
      hasNode: false,
      type: "link",
      query: null,
      prev: currentUrl => currentUrl.replace(/-(\d+)/, (match, string, offset) =>
        match.slice(0, match.length - string.length) + (Number(string) - 1)
      ),
    },
  },
};

const regexCheckUrl = /(?<protocol>https?:\/\/)(?<domain>\w+(\.\w+)+)\/.+/;

class StoryCrawler {
  detectWebsite(url) {
    if (!regexCheckUrl.test(url))
      return {
        protocol: null,
        domain: null,
      };

    const { protocol, domain } = url.match(regexCheckUrl).groups;

    const website = Object.keys(mapWebsiteWithRequiredNode).reduce(
      (web, key) =>
        !web && domain.match(mapWebsiteWithRequiredNode[key].domainRegex)
          ? key
          : web,
      null
    );

    return { protocol, domain, website };
  }

  mergeFullUrl(protocol, domain, url) {
    return regexCheckUrl.test(url) ? url : `${protocol}${domain}${url}`;
  }

  async fetchContent(chapterUrl) {
    return new Promise((resolve) => {
      const { protocol, domain, website } = this.detectWebsite(chapterUrl);

      if(!website){
        resolve({
          error: {
            message: `Not support! ${domain}`
          }
        })
      }

      console.log({ protocol, domain, website });

      axios.get(chapterUrl).then((res) => {
        const { data, config } = res;

        const $ = cheerio.load(data, {
          decodeEntities: false
        });

        const storyUrl = this.mergeFullUrl(
          protocol,
          domain,
          $(mapWebsiteWithRequiredNode[website].storyUrl).attr("href")
        );
        const content = $(
          mapWebsiteWithRequiredNode[website].contentNode
        ).html().replace(/(<p>(.*?)<\/p>)|(<script.*?>.*?<\/script>)/gim, (match, offset, string) => {
          return match.match(/<script.*?>.*?<\/script>/gim) ? '' : string.replace(/^\s+/gim, '') + '\n'
        });

        const storyTitle = $(mapWebsiteWithRequiredNode[website].storyTitle).text()
        const chapterTitle = $(mapWebsiteWithRequiredNode[website].chapterTitle).text()
        const authorTitle = $(mapWebsiteWithRequiredNode[website].authorTitle).text()

        const _findcurrentChapterIndex = $(mapWebsiteWithRequiredNode[website].currentChapterIndex.query).text().match(mapWebsiteWithRequiredNode[website].currentChapterIndex.regex).groups
        const currentChapterIndex = _findcurrentChapterIndex ? Number(_findcurrentChapterIndex.index) : null;
        const nextChapter = mapWebsiteWithRequiredNode[website].nextChapter.hasNode ? this.mergeFullUrl(protocol, domain, $(mapWebsiteWithRequiredNode[website].nextChapter.query).attr('href')) : mapWebsiteWithRequiredNode[website].nextChapter.next(chapterUrl)
        const prevChapter = mapWebsiteWithRequiredNode[website].prevChapter.hasNode ? this.mergeFullUrl(protocol, domain, $(mapWebsiteWithRequiredNode[website].prevChapter.query).attr('href')) : mapWebsiteWithRequiredNode[website].prevChapter.prev(chapterUrl)

        resolve({error: null, website, storyUrl, content, storyTitle, chapterTitle, authorTitle, currentChapter: chapterUrl, nextChapter, prevChapter, currentChapterIndex });
      })
      .catch(err => {
        resolve({
          error: err,
        })
      });
    });
  }
}

module.exports = new StoryCrawler();
