const db = require("./db");

module.exports = {
  getFeedbacks: async () => {
    try {
      const query = `select * from feedback where is_deleted = false`;
      const result = await db.query(query);
      return result.rows;
    } catch (err) {
      throw err;
    }
  },

  postFeedback: async (message) => {
    try {
      const time = new Date();
      const query = `insert into feedback (message, created_at)
        values ($1, $2)`;
      const values = [message, time];
      await db.query(query, values);
    } catch (err) {
      throw err;
    }
  },

  getFeedbackById: async (id) => {
    try {
      const query = `select * from feedback where feedback_id = $1 and is_deleted = false`;
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

  deleteFeedback: async (id) => {
    try {
      const query = `update feedback set is_deleted = true where feedback_id = $1`;
      const result = await db.query(query, [id]);
      if (!result.rowCount) {
        throw new Error("Message not found");
      }
    } catch (err) {
      throw err;
    }
  },
};
