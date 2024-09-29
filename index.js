import express from "express";
import fetch from "node-fetch";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;
const urls = process.env.URLS.split(",");
const interval = parseInt(process.env.INTERVAL, 10);
const startTime = Date.now();

function pingUrls() {
  const pingPromises = urls.map((url) =>
    fetch(url)
      .then((response) => {
        console.log(`Pinged ${url} - Status: ${response.status}`);
      })
      .catch((error) => {
        console.error(`Error pinging ${url}:`, error);
      })
  );

  return Promise.all(pingPromises);
}

pingUrls();
setInterval(pingUrls, interval * 60 * 1000);

app.get("/", (req, res) => {
  const uptime = Date.now() - startTime;
  const seconds = Math.floor((uptime / 1000) % 60);
  const minutes = Math.floor((uptime / (1000 * 60)) % 60);
  const hours = Math.floor((uptime / (1000 * 60 * 60)) % 24);
  const days = Math.floor(uptime / (1000 * 60 * 60 * 24));

  res.json({
    message: `RenderUp server is up and running for ${days} days, ${hours} hours, ${minutes} minutes, ${seconds} seconds`,
  });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
