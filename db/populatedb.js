const { Client } = require("pg");
require("dotenv").config();

const SQL = `
CREATE TABLE IF NOT EXISTS messages (
  id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  username VARCHAR(255) NOT NULL,
  text TEXT NOT NULL,
  email VARCHAR(255) NOT NULL,
  age INTEGER,
  bio VARCHAR(200),
  added TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

TRUNCATE TABLE messages RESTART IDENTITY;


INSERT INTO messages (username, text, email, age, bio) 
VALUES
  ('yawn', 'cereal hits way different at 2am for no reason lol', 'yawn@breakroom.io', 24, 'permanently tired and looking for snacks'),
  ('grxnd', 'spent an hour customizing my character just to cover them with a cape immediately im crying', 'grxnd@fastmail.com', 22, 'casual gamer, nocturnal, always listening to lofi'),
  ('skips', 'staring at my spotify playlists for 20 mins just to loop the same song again', 'skips@loop.io', 19, 'playlist curator and professional overthinker'),
  ('retro', 'if u remember trying to find mew under the truck in pokemon your back probably hurts today', 'retro@mew.com', 31, 'still looking under that truck in vermilion city since 1999'),
  ('idk_man', 'we all just pretending we know what we doing or what', 'idk@existential.cat', 27, 'just vibing through the confusion honestly'),
  ('afk', 'said thank u to an atm today my social battery is fully cooked', 'afk@offline.xyz', 20, 'brb going off grid for a week');
`;

async function main() {
  const connectionString = process.argv[2] || `postgresql://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_DATABASE}`;

  console.log("Seeding persistent messages schema...");
  
  const client = new Client({
    connectionString,
    ssl: {
      rejectUnauthorized: false,
    },
  });
  
  try {
    await client.connect();
    await client.query(SQL);
    console.log("Database successfully populated with persistent entries! ✨");
  } catch (err) {
    console.error("Seeding operation failed:", err);
  } finally {
    await client.end();
  }
}

main();
