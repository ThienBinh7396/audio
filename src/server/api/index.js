const express = require("express");
const router = express.Router();

const gtts = require("node-gtts")("vi");

const MultiStream = require("multistream");

const request = require("request");

const Logger = require("./../utils/Logger");
const Helper = require("./../utils/Helper");
const Status = require("./../utils/Status");

const ttvCrawler = require("./../utils/TtvCrawler");
const storyCrawler = require("./../utils/StoryCrawler");
const { LOG_FILE_PATH } = require("../constants/constants");

router.get("/wake-up", (req, res) => {
  let { accepter } = req.headers;

  if (accepter) {
    console.log("acc,", accepter);
    res.send("Permission deny...");
    return;
  }

  request("https://api.ipify.org/", (err, resp, body) => {
    Logger.saveLogInFile({
      content: `
        - ${Helper.formatDate(Date.now()).fullType}
        ${body}`,
      filePath: LOG_FILE_PATH,
      failCallback: (err) => res.send("err: " + err.code),
      successCallback: () => res.send("Heroku is waking up..."),
    });
  });
});

router.get("/story", (req, res) => {
  let { title } = req.query;

  if (!title)
    return res.send(Status.getStatus("error", "Title of story is required"));

  ttvCrawler.getInformationStory("Vu sư bất hủ").then((rs) => {
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
  let { idStory } = req.query;

  if (!idStory)
    return res.send(Status.getStatus("error", "Id of story is required"));

  ttvCrawler.getFullInformationStory(idStory).then((rs) => {
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

  ttvCrawler.getChapterByStoryId(storyId).then((rs) => {
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

  ttvCrawler.getPaginationChapterOfStory(storyId, page).then((rs) => {
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

  ttvCrawler.searchStoryByName(query).then((rs) => {
    if (rs) {
      res.send(Status.getStatus("success", "Successful", rs));
    } else {
      res.send(Status.getStatus("error", "Something went wrong. Try again!"));
    }
  });
});

router.get("/story/read", (req, res) => {
  let { storyUrl, chapter_url } = req.query;

  if (!storyUrl || !chapter_url)
    return res.send(
      Status.getStatus("error", "Url story and url chapter is required!")
    );

  ttvCrawler.getContentChapterOfStory(storyUrl, chapter_url).then((rs) => {
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

  ttvCrawler.getContentChapterOfStoryByChapterURL(chapter_url).then((rs) => {
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
  ttvCrawler.getContentHomePage().then((rs) => {
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
  const result = await storyCrawler.fetchContent(chapter_url);

  res.send(
    result.error
      ? Status.getStatus("error", result.error.message, result)
      : Status.getStatus("success", "Successful", result)
  );
});

router.get("/story/textToSpeech", async (req, res) => {
  res.set({ "Content-Type": "audio/mpeg" });

  const splitText = req.query.text.split(/,/);

  try {
    // gtts.stream(req.query.text).pipe(res);
    MultiStream(splitText.map((text) => gtts.stream(text))).pipe(res);
  } catch (error) {
    console.log("Error: ", error);
    res.send(null);
  }
});

module.exports = router;
