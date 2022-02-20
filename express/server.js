"use strict";
const express = require("express");
const path = require("path");
const serverless = require("serverless-http");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");
const ytdl = require("ytdl-core");
const router = express.Router();

router.get("/ibo", (req, res) => {
  res.send("ibo");
});

router.get("/info/:id", (req, res) => {
  let info = ytdl.getInfo(req.params.id);
  const data = {
    title: info.videoDetails.title,
    count: Number(info.videoDetails.viewCount),
    channelName: info.videoDetails.author.name,
    channelProfilePhoto: info.videoDetails.author.thumbnails[1],
    verified: info.videoDetails.author.verified,
    subscriber_count: info.videoDetails.author.subscriber_count,
    publishDate: info.videoDetails.publishDate,
    likes: info.videoDetails.likes,
    isPrivate: info.videoDetails.isPrivate,
    thumbnail: info.videoDetails.thumbnails[3],
    download_mp3: "/mp3?url=https://www.youtube.com/watch?v=" + req.params.id,
    download_mp4: "/mp4?url=https://www.youtube.com/watch?v=" + req.params.id,
  };
  res.status(204).json(JSON.stringify(data));
});

router.get("/mp3", (req, res) => {
  var url = req.query.url;
  const dataUrl = new URL(url);
  var videoId = dataUrl.searchParams.get("v");
  let info = ytdl.getInfo(videoId);
  ytdl.filterFormats(info.formats, "audioonly");
  res.header(
    "Content-Disposition",
    'attachment; filename="ibodev1-' + info.videoDetails.title + ".mp3"
  );
  ytdl(url, { format: "mp3" }).pipe(res);
});

router.get("/mp4", (req, res) => {
  var url = req.query.url;
  const dataUrl = new URL(url);
  var videoId = dataUrl.searchParams.get("v");
  let info = ytdl.getInfo(videoId);
  ytdl.filterFormats(info.formats, "audioonly");
  res.header(
    "Content-Disposition",
    'attachment; filename="ibodev1-' + info.videoDetails.title + ".mp4"
  );
  ytdl(url, { format: "mp4" }).pipe(res);
});

app.use(cors());
app.use(bodyParser.json());
app.use("/.netlify/functions/server", router); // path must route to lambda
app.use("/", (req, res) =>
  res.json({
    message: "https://ytdownload-api.netlify.app/.netlify/functions/server/ibo",
  })
);

module.exports = app;
module.exports.handler = serverless(app);
