const express = require("express");
const cors = require("cors");
const ytdl = require("ytdl-core");
const app = express();
const port = process.env.PORT || 3000;

app.use("/static", express.static("./static"));

app.listen(port, () => {
  console.log(`[Server Start] http://localhost:${port}`);
});
