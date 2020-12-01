const express = require("express");
const router = express.Router();

const path = require("path");

const request = require("request");
const fs = require("fs");

const Status = require("./../utils/Status");

const ttvCrawler = require("./../utils/TtvCrawler");

const filePath = path.join(__dirname + "./../../../dist/logs/log.txt");

const storyCrawler = require("./../utils/StoryCrawler");


function formatNumber(num) {
  return num > 9 ? num : `0${num}`;
}

function formatDate(str) {
  var date = new Date(str);

  var d = date.getDate();
  var month = date.getMonth() + 1;
  var y = date.getFullYear();
  var h = date.getHours();
  var m = date.getMinutes();
  var s = date.getSeconds();

  var f = "";
  var full = `${d}/${month}/${y} ${h}:${formatNumber(m)}:${formatNumber(s)}`;

  return {
    format: f,
    fullType: full
  };
}

router.get("/wake-up", (req, res) => {
  let {accept} = req.headers;
  
  if(!accept || accept != 'thienbinh'){
    res.send('Permission deny...');
    return;
  }
  
  
  request("https://api.ipify.org/", (err, resp, body) => {
    console.log(body);

    fs.open(filePath, "a+", (err, fd) => {
      if (err) {
        res.send("err: " + err.code);

        return;
      }

      let textAppend = `
- ${formatDate(Date.now()).fullType}
  ${body}`;

      fs.appendFile(fd, textAppend, "utf8", err => {
        if (err) {
          console.log(err);
          res.send("err: " + err.code);

          return;
        }

        res.send("Waking up...");
      });
    });
  });
});

router.get("/story", (req, res) => {
  let { title } = req.query;

  if (!title)
    return res.send(Status.getStatus("error", "Title of story is required"));

  ttvCrawler.getInformationStory("Vu sư bất hủ").then(rs => {
    if (rs) {
      res.send(Status.getStatus("success", "Successful", rs));
    } else {
      res.send(
        Status.getStatus("error", "Title story is invalid. Check again!")
      );
    }
  });
});

router.get("/story/info", (req, res) => {
  let { id_story } = req.query;

  if (!id_story)
    return res.send(Status.getStatus("error", "Id of story is required"));

  ttvCrawler.getFullInformationStory(id_story).then(rs => {
    if (rs) {
      res.send(Status.getStatus("success", "Successful", rs));
    } else {
      res.send(Status.getStatus("error", "Id of story is not found!"));
    }
  });
});

router.get("/story/chapter", (req, res) => {
  let { storyId } = req.query;

  if (!storyId)
    return res.send(Status.getStatus("error", "Id of story is required"));

  ttvCrawler.getChapterByStoryId(storyId).then(rs => {
    if (rs) {
      res.send(Status.getStatus("success", "Successful", rs));
    } else {
      res.send(
        Status.getStatus("error", "Id of story is invalid. Check again!")
      );
    }
  });
});

router.get("/story/chapter-with-paginate", (req, res) => {
  let { storyId, page } = req.query;

  if (!storyId)
    return res.send(Status.getStatus("error", "Id of story is required"));

  ttvCrawler.getPaginationChapterOfStory(storyId, page).then(rs => {
    if (rs) {
      res.send(Status.getStatus("success", "Successful", rs));
    } else {
      res.send(
        Status.getStatus("error", "Id of story is invalid. Check again!")
      );
    }
  });
});

router.get("/story/search", (req, res) => {
  let { query } = req.query;

  if (!query) return res.send(Status.getStatus("error", "query is required!"));

  ttvCrawler.searchStoryByName(query).then(rs => {
    if (rs) {
      res.send(Status.getStatus("success", "Successful", rs));
    } else {
      res.send(Status.getStatus("error", "Something went wrong. Try again!"));
    }
  });
});

router.get("/story/read", (req, res) => {
  let { story_url, chapter_url } = req.query;

  if (!story_url || !chapter_url)
    return res.send(
      Status.getStatus("error", "Url story and url chapter is required!")
    );

  ttvCrawler.getContentChapterOfStory(story_url, chapter_url).then(rs => {
    if (rs) {
      res.send(Status.getStatus("success", "Successful", rs));
    } else {
      res.send(
        Status.getStatus("error", "Url story and url chapter is invalid!")
      );
    }
  });
});

router.get("/story/read-chapter-url", (req, res) => {
  let { chapter_url } = req.query;

  if (!chapter_url)
    return res.send(
      Status.getStatus("error", "Url story and url chapter is required!")
    );

  ttvCrawler.getContentChapterOfStoryByChapterURL(chapter_url).then(rs => {
    if (rs) {
      res.send(Status.getStatus("success", "Successful", rs));
    } else {
      res.send(
        Status.getStatus("error", "Url story and url chapter is invalid!")
      );
    }
  });
});

router.get("/story/home", (req, res) => {
  ttvCrawler.getContentHomePage().then(rs => {
    if (rs) {
      res.send(Status.getStatus("success", "Successful", rs));
    } else {
      res.send(
        Status.getStatus("error", "Url story and url chapter is invalid!")
      );
    }
  });
});

router.post("/story/fetchContentByUrl", async (req, res) => {
  let { chapter_url } = req.body;
  const result = await storyCrawler.fetchContent(chapter_url)

  res.send(result.error ? Status.getStatus("error", result.error.message, result) : Status.getStatus("success", "Successful", result))
})

const axios = require("axios");

router.get("/xxx", (req, res) => {
  axios
    .get("https://m.truyen.tangthuvien.vn/doc-truyen/23003", {
      get_list_chapter: "23003"
    })
    .then(rs => {
      let { data } = rs;
      res.send(data);
    })
    .catch(err => {
      console.log(err);

      res.send("err");
    });
});

async function getSpeechFpt(text, time = 0) {
  return new Promise(res => {
    axios
      .get("https://speech.openfpt.vn/speech", {
        params: {
          "voice-type": "new",
          text: text,
          gender: "banmai",
          speed: 0
        }
      })
      .then(rs => {
        let { data } = rs;

        res(data);
      })
      .catch(err => {
        if (time == 3) {
          res({ Url: "" });
        }
        console.log(time);

        setTimeout(async () => {
          let rs = await getSpeechFpt(text, time + 1);
        }, 2000);
      });
  });
}

async function getSpeechGoole(text, time = 0) {
  return new Promise(res => {
    axios
      .get("https://translate.google.com/translate_tts", {
        params: {
          e: "UTF-8",
          total: 1,
          idx: 0,
          client: "tw-ob",
          tl: "vi",
          q:
            '"Hách" một cái 12 tuổi tả hữu mái tóc màu đen nam hài hiện đang vung lên một cái'
        }
      })

      .then(rs => {
        let { data } = rs;
        console.log(data);
        res(data);
      })
      .catch(err => {
        if (time == 3) {
          res({ data: null });
        }
        console.log(time);

        setTimeout(async () => {
          let rs = await getSpeechGoole(text, time + 1);
          res(rs);
        }, 2000);
      });
  });
}

async function getSpeechVn(text, time = 0) {
  return new Promise(res => {
    axios
      .post(
        "http://cloudtalk.vn/tts",
        {
          style: "fast",
          ref: "http://www.vnspeech.com/",
          sig: "reserved",
          pid: "reserved",
          uid: "reserved",
          otp: "reserved!",
          text: text
        },
        {
          headers: { "X-Requested-With": "XMLHttpRequest" },
          Cookie:
            "_ga=GA1.2.1370980771.1579148191; _gid=GA1.2.1089472553.1579148191; _gat=1",
          Host: "cloudtalk.vn",
          Origin: "http://cloudtalk.vn",
          Referer: "http://cloudtalk.vn/nhmtts-online.html"
        }
      )

      .then(rs => {
        let { data } = rs;
        console.log(data);
        res({ Url: `http://cloudtalk.vn/ttsoutput?id=${data}` });
      })
      .catch(err => {
        let { response } = err;
        console.log(response.data);
        if (time == 3) {
          res({ Url: null });

          return;
        }

        setTimeout(async () => {
          let rs = await getSpeechVn(text, time + 1);
          res(rs);
        }, 2000);
      });
  });
}

router.post("/textToSpeech", async (req, res) => {
  let { type, text } = req.body;

  switch (type) {
    case "fpt":
      res.send(await getSpeechFpt(text));
      break;
    case "google":
      res.send({ data: await getSpeechGoole(text) });

    case "vnspeech":
      res.send(await getSpeechVn(text));
  }
});

module.exports = router;
