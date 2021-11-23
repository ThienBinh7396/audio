const express = require("express");
const router = express.Router();

const gtts = require("node-gtts")("vi");

const MultiStream = require('multistream');

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
  let { accept } = req.headers;

  if (!accept || accept != 'thienbinh') {
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





router.get("/story/textToSpeech", async (req, res) => {
  console.log(req.query.text)
  res.set({ "Content-Type": "audio/mpeg" });
  try {
    // gtts.stream(req.query.text).pipe(res);
    const test = gtts.stream("Ba cân trở lên cá chép cửu đầu, năm cân trở lên Thảo Ngư mười một đầu")

const test2 = gtts.stream("Ba cân trở lên cá chép cửu đầu")
MultiStream([test, test2]).pipe(res)
  } catch (error) {
    console.log("Error: ", error)
    res.send(null)
  }
});

module.exports = router;
