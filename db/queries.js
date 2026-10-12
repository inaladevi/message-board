const pool = require("./pool");

async function getAllMessages(searchKeyword = "") {
  if (searchKeyword) {
   
    const sqlQuery = `
      SELECT * FROM messages 
      WHERE username ILIKE $1 OR email ILIKE $1 
      ORDER BY added DESC
    `;
    const { rows } = await pool.query(sqlQuery, [`%${searchKeyword}%`]);
    return rows;
  } else {

    const { rows } = await pool.query("SELECT * FROM messages ORDER BY added DESC");
    return rows;
  }
}
async function insertMessage(user, text, email, age, bio) {
  const sqlQuery = `
    INSERT INTO messages (username, text, email, age, bio) 
    VALUES ($1, $2, $3, $4, $5)
  `;
  await pool.query(sqlQuery, [user, text, email, age ? parseInt(age) : null, bio || ""]);
}

async function deleteAllMessages() {
  await pool.query("TRUNCATE TABLE messages RESTART IDENTITY");
}

module.exports = {
  getAllMessages,
  insertMessage,
  deleteAllMessages
};
