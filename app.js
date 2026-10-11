const express = require("express");
const path = require("node:path");
const { body, validationResult } = require("express-validator"); 
const db = require("./db/queries");

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

const messages = [
  {
    text: "cereal hits way different at 2am for no reason lol",
    user: "yawn",
    added: new Date(Date.now() - 7200000),
    email: "yawn@breakroom.io",
    age: 24,
    bio: "permanently tired and looking for snacks"
  },
  {
    text: "spent an hour customizing my character just to cover them with a cape immediately im crying",
    user: "grxnd",
    added: new Date(Date.now() - 3600000),
    email: "grxnd@fastmail.com",
    age: 22,
    bio: "casual gamer, nocturnal, always listening to lofi"
  },
  {
    text: "staring at my spotify playlists for 20 mins just to loop the same song again",
    user: "skips",
    added: new Date(Date.now() - 1800000),
    email: "skips@loop.io",
    age: 19,
    bio: "playlist curator and professional overthinker"
  },
  {
    text: "if u remember trying to find mew under the truck in pokemon your back probably hurts today",
    user: "retro",
    added: new Date(Date.now() - 900000),
    email: "retro@mew.com",
    age: 31,
    bio: "still looking under that truck in vermilion city since 1999"
  },
  {
    text: "we all just pretending we know what we doing or what",
    user: "idk_man",
    added: new Date(Date.now() - 300000),
    email: "idk@existential.cat",
    age: 27,
    bio: "just vibing through the confusion honestly"
  },
  {
    text: "said thank u to an atm today my social battery is fully cooked",
    user: "afk",
    added: new Date(),
    email: "afk@offline.xyz",
    age: 20,
    bio: "brb going off grid for a week"
  }
];

const messageValidationRules = [
  body("messageUser").trim().notEmpty().withMessage("handle or name is required"),
  body("messageText").trim().notEmpty().withMessage("message text cannot be empty"),
  body("messageEmail").trim().isEmail().withMessage("must be a valid email address"),
  body("messageAge").optional({ checkFalsy: true }).isInt({ min: 18, max: 120 }).withMessage("age must be between 18 and 120"),
  body("messageBio").optional().isLength({ max: 200 }).withMessage("bio cannot exceed 200 characters")
];

app.get("/", async (req, res) => {
  try {

    const usernames = await db.getAllUsernames();
    
    console.log("Usernames from DB:", usernames);
  } catch (err) {
    console.error("Error fetching usernames from database:", err);
  }

  res.render("index", { messages });
});


app.get("/new", (req, res) => {
  res.render("form", { errors: null, prevInput: {} });
});

app.get("/message/:id", (req, res) => {
  const message = messages[req.params.id];

  if (!message) {
    return res.status(404).send("Whoops! That note doesn't exist.");
  }

  res.render("message", { message });
});

app.post("/new", messageValidationRules, async (req, res) => {
  
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    
    return res.render("form", { 
      errors: errors.array(), 
      prevInput: req.body 
    });
  }

  console.log("username to be saved: ", req.body.messageUser);

  try {

    await db.insertUsername(req.body.messageUser);
  } catch (err) {
    console.error("Error inserting username into database:", err);
  }

  const messageText = req.body.messageText;
  const messageUser = req.body.messageUser;
  const messageEmail = req.body.messageEmail;
  const messageAge = req.body.messageAge;
  const messageBio = req.body.messageBio;

  messages.push({
    text: messageText,
    user: messageUser,
    added: new Date(),
    email: messageEmail,
    age: messageAge ? parseInt(messageAge) : null, 
    bio: messageBio || "" 
  });

  res.redirect("/");
});

app.get("/search", (req, res) => {
  const keyword = req.query.searchQuery ? req.query.searchQuery.toLowerCase() : "";

  const searchResults = messages.filter(message => {
    return message.user.toLowerCase().includes(keyword) || 
           message.email.toLowerCase().includes(keyword);
  });

  res.render("search", { searchResults, queryText: req.query.searchQuery || "", messages });
});

app.listen(3000, () => {
  console.log("Server running on port 3000");
});

