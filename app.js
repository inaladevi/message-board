const express = require("express");
const path = require("node:path");

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

const messages = [
  {
    text: "cereal hits way different at 2am for no reason lol",
    user: "yawn",
    added: new Date(Date.now() - 7200000)
  },
  {
    text: "spent an hour customizing my character just to cover them with a cape immediately im crying",
    user: "grxnd",
    added: new Date(Date.now() - 3600000)
  },
  {
    text: "staring at my spotify playlists for 20 mins just to loop the same song again",
    user: "skips",
    added: new Date(Date.now() - 1800000)
  },
  {
    text: "if u remember trying to find mew under the truck in pokemon your back probably hurts today",
    user: "retro",
    added: new Date(Date.now() - 900000)
  },
  {
    text: "we all just pretending we know what we doing or what",
    user: "idk_man",
    added: new Date(Date.now() - 300000)
  },
  {
    text: "said thank u to an atm today my social battery is fully cooked",
    user: "afk",
    added: new Date()
  }
];


app.get("/", (req, res) => {
  res.render("index", { messages });
});

app.get("/new", (req, res) => {
  res.render("form");
});

app.get("/message/:id", (req, res) => {
  const message = messages[req.params.id];

  if (!message) {
    return res.status(404).send("Whoops! That note doesn't exist.");
  }

  res.render("message", { message });
});

app.post("/new", (req, res) => {
  const messageText = req.body.messageText;
  const messageUser = req.body.messageUser;

  messages.push({
    text: messageText,
    user: messageUser,
    added: new Date()
  });

  res.redirect("/");
});

app.listen(3000, () => {
  console.log("Server running on port 3000");
});

