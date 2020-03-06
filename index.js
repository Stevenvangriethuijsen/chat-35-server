const express = require("express");
const Sse = require("json-sse");
const cors = require("cors");

const app = express();
const corsMiddleware = cors();
const parser = express.json();

const port = process.env.PORT || 4000;
app.use(corsMiddleware);
app.use(parser);

const stream = new Sse();
const db = {};

db.messages = [];

app.get("/stream", (req, res, next) => {
  // if (db.messages.length > 10) {
  //   const messages = db.messages.slice(Math.max(db.messages.length - 5, 0));
  //   stream.updateInit(messages);
  //   stream.init(req, res);
  //   return;
  // } else {
  //   stream.updateInit(db.messages);
  //   stream.init(req, res);
  // }

  const action = {
    type: "ALL_MESSAGES",
    payload: db.messages
  };
  stream.updateInit(action);
  stream.init(req, res);
  // stream updateinit sends previously send messages to new logged in users
});

app.post("/message", (req, res) => {
  const { text } = req.body;

  db.messages.push(text);

  res.send(text);

  const action = {
    type: "NEW_MESSAGE",
    payload: text
  };

  stream.send(action);

  console.log("db test:", db);
});

app.listen(port, console.log(`All aport! ${port} Choooo Chooo!`));
