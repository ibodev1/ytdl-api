const express = require("express");
const cors = require("cors");
const ytdl = require("ytdl-core");
const app = express();
const port = process.env.PORT || 5000;

app.get("/", (req, res) => {
  res.status(200).send({ status: 200, message: "It Works!" });
});

app.get("/info/:id", async (req, res) => {
  let info = await ytdl.getInfo(req.params.id);
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
    download_mp3:
      "https://ytdown-api.herokuapp.com/mp3?url=https://www.youtube.com/watch?v=" +
      req.params.id,
    download_mp4:
      "https://ytdown-api.herokuapp.com/mp4?url=https://www.youtube.com/watch?v=" +
      req.params.id,
  };
  res.status(200).send(JSON.stringify(data));
});

app.get("/mp3", async (req, res) => {
  var url = req.query.url;
  const dataUrl = new URL(url);
  var videoId = dataUrl.searchParams.get("v");
  let info = await ytdl.getInfo(videoId);
  console.log("İndiriliyor..." + info.videoDetails.title);
  ytdl.filterFormats(info.formats, "audioonly");
  res.header(
    "Content-Disposition",
    'attachment; filename="ibodev1-' + info.videoDetails.title + ".mp3"
  );
  ytdl(url, {
    quality: "highestaudio",
    filter: "audioonly",
    format: "mp3",
  });
});

app.get("/mp4", async (req, res) => {
  var url = req.query.url;
  const dataUrl = new URL(url);
  var videoId = dataUrl.searchParams.get("v");
  let info = await ytdl.getInfo(videoId);
  console.log("İndiriliyor..." + info.videoDetails.title);
  res.header(
    "Content-Disposition",
    'attachment; filename="ibodev1-' + info.videoDetails.title + ".mp4"
  );
  ytdl(url, { quality: "highestvideo", format: "mp4" }).pipe(res);
});

app.use(cors());

app.listen(port, () => {
  console.log(`[Server Start] https://ytdown-api.herokuapp.com:${port}`);
});
