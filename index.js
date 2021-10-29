const express = require("express");
const app = express();
const port = process.env.PORT || 5000;

app.get("/", (req, res) => {
  res.send("Server is running from localhost 5000");
});

app.listen(port, () => {
  console.log("Server Running in port", port);
});
