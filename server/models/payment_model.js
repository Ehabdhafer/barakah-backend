const db = require("./db");

module.exports = {
  checkCard: async (number, month, year, cvc) => {
    try {
      const checkcard = `select * from bank_cards WHERE number = $1 AND month = $2 AND year = $3 AND cvc = $4`;
      const checked = await db.query(checkcard, [number, month, year, cvc]);
      return checked.rows;
    } catch (err) {
      throw err;
    }
  },

  createPayment: async (
    user_id,
    order_id,
    payment_amount,
    payment_method,
    card_id,
    cardname
  ) => {
    try {
      const payment_time = new Date();
      const payment_status = "approved";
      const query = `INSERT INTO payments (user_id, order_id, payment_amount, payment_status, payment_method
         , payment_time, card_id, cardname)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
           RETURNING payment_id`;
      const values = [
        user_id,
        order_id,
        payment_amount,
        payment_status,
        payment_method,
        payment_time,
        card_id,
        cardname,
      ];
      const result = await db.query(query, values);
      return result.rows[0].payment_id;
    } catch (err) {
      throw err;
    }
  },

  updateCardBalance: async (card_id, payment_amount) => {
    try {
      const updateBalanceQuery = `UPDATE bank_cards
     SET balance = balance - $1
     WHERE card_id = $2`;
      const updateBalanceValues = [payment_amount, card_id];
      await db.query(updateBalanceQuery, updateBalanceValues);
    } catch (err) {
      throw err;
    }
  },

  updateUserSubscription: async (user_id) => {
    try {
      const updateuserquery = `update users set subscription = true where user_id = $1`;
      await db.query(updateuserquery, [user_id]);
    } catch (err) {
      throw err;
    }
  },

  getPayments: async () => {
    try {
      const query = `select * from payments where is_deleted = false`;
      const result = await db.query(query);
      return result.rows;
    } catch (err) {
      throw err;
    }
  },
};
