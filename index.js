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
    download_mp3: "/mp3?url=https://www.youtube.com/watch?v=" + req.params.id,
    download_mp4: "/mp4?url=https://www.youtube.com/watch?v=" + req.params.id,
  };
  res.status(200).send(JSON.stringify(data));
});

app.get("/mp3", async (req, res) => {
  var url = req.query.url;
  const dataUrl = await new URL(url);
  var videoId = dataUrl.searchParams.get("v");
  let info = await ytdl.getInfo(videoId);
  ytdl.filterFormats(info.formats, "audioonly");
  res.header(
    "Content-Disposition",
    'attachment; filename="ibodev1-' + info.videoDetails.title + ".mp3"
  );
  ytdl(url, { format: "mp3" }).pipe(res);
});

app.get("/mp4", async (req, res) => {
  var url = req.query.url;
  const dataUrl = await new URL(url);
  var videoId = dataUrl.searchParams.get("v");
  let info = await ytdl.getInfo(videoId);
  ytdl.filterFormats(info.formats, "audioonly");
  res.header(
    "Content-Disposition",
    'attachment; filename="ibodev1-' + info.videoDetails.title + ".mp4"
  );
  ytdl(url, { format: "mp4" }).pipe(res);
});

app.use(cors());

app.listen(port, () => {
  console.log(`[Server Start] http://localhost:${port}`);
});
