require("dotenv").config(); 
const express = require("express");
const path = require("node:path");
const { body, validationResult } = require("express-validator"); 
const db = require("./db/queries"); 

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

const messageValidationRules = [
  body("messageUser").trim().notEmpty().withMessage("handle or name is required"),
  body("messageText").trim().notEmpty().withMessage("message text cannot be empty"),
  body("messageEmail").trim().isEmail().withMessage("must be a valid email address"),
  body("messageAge").optional({ checkFalsy: true }).isInt({ min: 18, max: 120 }).withMessage("age must be between 18 and 120"),
  body("messageBio").optional().isLength({ max: 200 }).withMessage("bio cannot exceed 200 characters")
];

app.get("/", async (req, res) => {
  try {

    const keyword = req.query.searchQuery || "";
    
    const databaseMessages = await db.getAllMessages(keyword);
    
    res.render("index", { messages: databaseMessages, queryText: keyword });
  } catch (err) {
    console.error("Error loading message feed container:", err);
    res.status(500).send("Database sync breakdown occurred.");
  }
});

app.get("/new", (req, res) => {
  res.render("form", { errors: null, prevInput: {} });
});

app.post("/new", messageValidationRules, async (req, res) => {
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {

    return res.render("form", { 
      errors: errors.array(), 
      prevInput: req.body 
    });
  }

  try {
    await db.insertMessage(
      req.body.messageUser,
      req.body.messageText,
      req.body.messageEmail,
      req.body.messageAge,
      req.body.messageBio
    );
    
    res.redirect("/"); 
  } catch (err) {
    console.error("Failed to commit note asset to database:", err);
    res.status(500).send("Storage layer integration failure.");
  }
});

app.get("/delete", async (req, res) => {
  try {
    await db.deleteAllMessages();
    
    res.redirect("/");
  } catch (err) {
    console.error("Failed to execute database reset sequence:", err);
    res.status(500).send("Database wipe command interrupted.");
  }
});


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Persistent message server active on port ${PORT}`);
});
