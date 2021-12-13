// Dependencies
const express = require("express");

// Configure & Run the http server
const app = express();

app.use(express.static(__dirname, { dotfiles: "allow" }));
app.get("/", (req, res) => {
  res.send("testing");
});

app.listen(3000, () => {
  console.log("HTTP server running on port 3000");
});
