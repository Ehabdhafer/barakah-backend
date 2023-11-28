const db = require("./db");

module.exports = {
  getContacts: async () => {
    try {
      const query = `select * from contact_us where is_deleted = false`;
      const result = await db.query(query);
      return result.rows;
    } catch (err) {
      throw err;
    }
  },

  postContact: async (name, email, subject, message) => {
    try {
      const time = new Date();
      const query = `insert into contact_us (name, email, subject, message, submitted_at)
        values ($1, $2, $3, $4, $5)`;
      const values = [name, email, subject, message, time];
      await db.query(query, values);
    } catch (err) {
      throw err;
    }
  },

  getContactById: async (id) => {
    try {
      const query = `select * from contact_us where contact_id = $1 and is_deleted = false`;
      const result = await db.query(query, [id]);
      if (!result.rowCount) {
        throw new Error("Message not found");
      } else {
        return result.rows;
      }
    } catch (err) {
      throw err;
    }
  },

  deleteContact: async (id) => {
    try {
      const query = `update contact_us set is_deleted = true where contact_id = $1`;
      const result = await db.query(query, [id]);
      if (!result.rowCount) {
        throw new Error("Message not found");
      }
    } catch (err) {
      throw err;
    }
  },
};
