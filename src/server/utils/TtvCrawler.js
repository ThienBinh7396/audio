// Crawler data from website
// https://truyen.tangthuvien.vn/

const Helper = require("./Helper");
const request = require("request");
const cheerio = require("cheerio");
const url = require("url");

const axios = require("axios");

class TtvCrawler {
  constructor() {
    // This url is used to search stories by name, returns a json
    // https://truyen.tangthuvien.vn/tim-kiem?term=vu++s%C6%B0
    this.baseSearchStoryUrl =
      "https://m.truyen.tangthuvien.vn/search-result?term=";

    // This url is used to get all chapter by story id, return a html page.
    // Ex: https://truyen.tangthuvien.vn/story/chapters?storyId=1123
    this.baseGetChaptersByStoryID =
      "https://truyen.tangthuvien.vn/story/chapters?storyId=";

    // This url is used to get information of story.
    //Ex: https://truyen.tangthuvien.vn/doc-truyen/vu-su-bat-hu
    this.baseGetInformationStoryUrl =
      "https://m.truyen.tangthuvien.vn/doc-truyen/";

    // This url is used to get full information of story.
    // Method: Post
    // Params: idStory
    this.baseGetFullInformationStoryUrl =
      "https://nae.vn/ttv/ttv_apiv2/public/get_list_story_author";

    // This url is used to get content of chapter by story name and href params of chapter
    // https://m.truyen.tangthuvien.vn/doc-truyen/vu-su-than-toa/chuong-1150
    this.baseGetContentChapterOfStory =
      "https://truyen.tangthuvien.vn/doc-truyen/";

    // This url is used to get contente of home page
    this.baseGetContentHome =
      "https://nae.vn/ttv/ttv_apiv2/public/get_list_story_home";

    this.baseGetPaginationChapterOfStory =
      "https://truyen.tangthuvien.vn/doc-truyen/page/";
  }

  fullUrlGetInformationStory(titleStory) {
    return `${this.baseGetInformationStoryUrl}${Helper.changeAlias(
      titleStory
    ).replace(/\s+/gim, "-")}`;
  }

  async getInformationStory(titleStory) {
    return new Promise((res) => {
      request(
        encodeURI(`${this.fullUrlGetInformationStory(titleStory)}`),
        (err, response, body) => {
          if (err || response.statusCode > 299) {
            console.log(
              `Crawler faild: ${this.fullUrlGetInformationStory(titleStory)}`
            );
            res(null);
          } else {
            let $ = cheerio.load(body);

            let meta = $("meta");
            let realMeta = {};

            let story = {
              title: titleStory,
            };

            Object.keys(meta).forEach((key) => {
              let { attribs } = meta[key];
              if (!attribs) return;
              if (
                (attribs.property && /(^og:.+)/.test(attribs.property)) ||
                (attribs.name && /^book.+/.test(attribs.name))
              ) {
                let _key = attribs.property || attribs.name;

                realMeta[_key] = meta[key].attribs.content;
              }
            });
            story.type = realMeta["og:type"];
            story.url = realMeta["og:url"];
            story.image = realMeta["og:image"];
            story.updateTime = realMeta["og:updated_time"];
            story.id = realMeta["book_detail"];
            story["book_path"] = realMeta["book_path"];

            console.log(realMeta);

            res(story);
          }
        }
      );
    });
  }

  fullUrlGetChapterOfStory(storyId) {
    return `${this.baseGetChaptersByStoryID}${storyId}`;
  }

  async getChapterByStoryId(storyId) {
    return new Promise((res) => {
      request(
        encodeURI(this.fullUrlGetChapterOfStory(storyId)),
        (err, response, body) => {
          if (err || response.statusCode > 299) {
            res(null);
          } else {
            let $ = cheerio.load(body);

            let dividers = $(".divider-chap").contents();

            let chapters = [];

            let ulIndex = 0;

            Object.keys(dividers).forEach((key) => {
              if (!/\d+/gim.test(key)) return;

              ulIndex = ulIndex + 2;
              let textDivider = dividers[key].data;

              let lists = $(`ul:nth-child(${ulIndex}) li a`);

              let chapter = [];

              if (chapters.length == 0) {
                let lists = $(`ul li a`);

                let chapter = [];

                Object.keys(lists).forEach((list_key) => {
                  if (!/\d+/gim.test(list_key)) return;

                  let { title, href } = lists[list_key].attribs;

                  let chapterId = lists[list_key].parent.attribs["ng-chap"];
                  chapter.push({
                    type: "chapter",
                    title,
                    chapterId,
                    href: href.match(/(?<url>[^(\/)]*?)$/)[1],
                  });
                });

                chapters.push(...chapter);
              }

              res(chapters);
            });
          }
        }
      );
    });
  }

  async getPaginationChapterOfStory(idStory, page = 0) {
    return new Promise((res) => {
      page = Number(page);
      axios
        .get(`${this.baseGetPaginationChapterOfStory}${idStory}`, {
          params: {
            limit: 75,
            web: 1,
            page,
          },
        })
        .then((rs) => {
          let $ = cheerio.load(rs.data);

          let lists = $(".cf li a");

          let chapters = [];

          Object.keys(lists).forEach((key) => {
            if (!/\d+/gim.test(key)) return;

            let { href, title } = lists[key].attribs;

            chapters.push({
              idStory: Number(idStory),
              title,
              href,
            });
          });

          try {
            let maxChapter = Number(
              $(".pagination li:last-child a")["0"].attribs.onclick.match(
                /\d+/
              )[0]
            );

            let data = {
              chapters,
              currentPage: page,
              totalPage: maxChapter,
              hasNextPage: page < maxChapter,
              hasPrevPage: page > 0,
            };

            res(data);
          } catch (error) {
            console.log("err: ", error);

            res(null);
          }
        })
        .catch((err) => {
          console.log("err: ", err);
          res(null);
        });
    });
  }

  fullUrlSearchStoryByName(query) {
    return `${this.baseSearchStoryUrl}${query}`;
  }

  async searchStoryByName(query) {
    return new Promise((res) => {
      request(
        encodeURI(`${this.fullUrlSearchStoryByName(query)}`),
        (err, response, body) => {
          console.log(query, err);
          if (err || response.statusCode > 299) {
            console.log("Crawler fail", this.fullUrlSearchStoryByName(query));
            res(null);
          } else {
            res(JSON.parse(body));
          }
        }
      );
    });
  }

  async getFullInformationStory(idStory) {
    return new Promise((res) => {
      axios
        .post(this.baseGetFullInformationStoryUrl, {
          idStory: idStory,
        })
        .then((rs) => {
          let { data, config } = rs;

          let _url = url.parse(config.url);
          console.log(config, _url);

          if (data.status == 1) {
            let { story } = data;

            story.storyUrl = story.link_share.match(/(?<url>[^(\/)]*?)$/)[1];

            res(data.story);
          } else {
            res(null);
          }
        })
        .catch((err) => {
          res(null);
        });
    });
  }

  fullUrlGetContentChapterOfStory(urlStory, urlChapter) {
    return `${this.baseGetContentChapterOfStory}${urlStory}/${urlChapter}`;
  }

  async getContentChapterOfStory(urlStory, urlChapter) {
    return new Promise((res) => {
      request(
        encodeURI(this.fullUrlGetContentChapterOfStory(urlStory, urlChapter)),
        (err, response, body) => {
          if (err || response.statusCode > 299) {
            res(null);
          } else {
            let $ = cheerio.load(body);

            let id = Number(
              $(`.form-box-report input[name='storyId']`).attr("value")
            );

            let content = $(".box-chap").text();

            let titleStory = $("h1.truyen-title a").text();

            let chapter = $("h1.truyen-title + h2").text();

            res({
              id,
              titleStory,
              urlStory: urlStory,
              chapter,
              content,
            });
          }
        }
      );
    });
  }

  async getContentChapterOfStoryByChapterURL(urlChapter) {
    return new Promise((res) => {
      request(encodeURI(urlChapter), (err, response, body) => {
        if (err || response.statusCode > 299) {
          res(null);
        } else {
          let $ = cheerio.load(body);

          let id = Number(
            $(`.form-box-report input[name='storyId']`).attr("value")
          );

          let content = $(".box-chap").text();

          let titleStory = $("h1.truyen-title a").text();

          let chapter = $("h1.truyen-title + h2").text();

          res({
            id,
            titleStory,
            url_chapter: urlChapter,
            chapter,
            content,
          });
        }
      });
    });
  }

  async getContentHomePage() {
    return new Promise((res) => {
      axios
        .get(this.baseGetContentHome)
        .then((rs) => {
          let { data } = rs;
          res(data);
        })
        .catch((err) => {
          res(null);
        });
    });
  }
}
module.exports = new TtvCrawler();
