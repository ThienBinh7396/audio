const express = require("express");
const router = express.Router();
const path = require("path");
const gtts = require("node-gtts")("vi");
const filepath = path.join(__dirname, "i-love-you.wav");

router.get("/speech", (_, res) => {
  gtts.save(
    filepath,
    "Cars came into global use during the 20th century, and developed economies depend on them. The year 1886 is regarded as the birth year of the car when German inventor Karl Benz patented his Benz Patent-Motorwagen.[1][4][5] Cars became widely available in the early 20th century. One of the first cars accessible to the masses was the 1908 Model T, an American car manufactured by the Ford Motor Company. Cars were rapidly adopted in the US, where they replaced animal-drawn carriages and carts.[6] In Europe and other parts of the world, demand for automobiles did not increase until after World War II.[6]",
    function(data) {
      res.send(data);
    }
  );
});

module.exports = router;
