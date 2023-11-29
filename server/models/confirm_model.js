const db = require("./db");

module.exports = {
  postConfirmOrder: async (
    order_id,
    accept_location,
    phone,
    user_iddonation,
    collectionTime
  ) => {
    try {
      await db.query("BEGIN");
      const query = `INSERT INTO confirmorder (order_id, donation_id,accept_location,phone,accept_time,user_iddonation,user_idrequest,collectiontime)
        SELECT order_id, donation_id,
        $2 as accept_location, $3 as phone, $4 as accept_time, $5 as user_iddonation, user_id, $6 as collectiontime
        FROM orders
        WHERE order_id = $1`;
      const accept_time = new Date();
      const values = [
        order_id,
        accept_location,
        phone,
        accept_time,
        user_iddonation,
        collectionTime,
      ];
      await db.query(query, values);

      const donationSoftQuery1 = `
    UPDATE donation
    SET is_deleted = true
    FROM confirmorder
    WHERE donation.donation_id = confirmorder.donation_id
    AND confirmorder.order_id = $1;
  `;

      const donationSoftQuery2 = `
    UPDATE orders
    SET is_deleted = true
    FROM confirmorder
    WHERE orders.order_id = confirmorder.order_id
    AND confirmorder.order_id = $1;
  `;

      await db.query(donationSoftQuery1, [order_id]);
      await db.query(donationSoftQuery2, [order_id]);
      await db.query("COMMIT");
    } catch (err) {
      throw err;
    }
  },

  getConfirmedOrders: async () => {
    try {
      const query = `SELECT * FROM confirmorder 
        JOIN donation ON confirmorder.donation_id = donation.donation_id
        JOIN orders ON confirmorder.order_id = orders.order_id
        WHERE confirmorder.is_deleted = false`;
      const result = await db.query(query);
      return result.rows;
    } catch (err) {
      throw err;
    }
  },

  getConfirmedOrderById: async (id) => {
    try {
      const query = `SELECT * FROM confirmorder 
        JOIN donation ON confirmorder.donation_id = donation.donation_id
        JOIN orders ON confirmorder.order_id = orders.order_id
        WHERE confirmorder.is_deleted = false AND confirmorder.confirm_id = $1`;
      const result = await db.query(query, [id]);
      return result.rows;
    } catch (err) {
      throw err;
    }
  },

  deleteConfirmedOrder: async (id) => {
    try {
      const query = `UPDATE confirmorder SET is_deleted = true WHERE confirm_id = $1`;
      const result = await db.query(query, [id]);
      if (!result.rowCount) {
        throw new Error("Order not found");
      }
    } catch (err) {
      throw err;
    }
  },
  getConfirmHistorydonate: async (user_id) => {
    try {
      const result = await db.query(
        `select *,donation.user_id from orders inner join 
        donation on orders.donation_id = donation.donation_id
        where orders.is_deleted = true and donation.user_id = $1`,
        [user_id]
      );
      if (!result.rowCount) {
        throw new Error("Order not found");
      }
      return result.rows;
    } catch (err) {
      throw err;
    }
  },
  getConfirmHistoryorder: async (user_id) => {
    try {
      const result = await db.query(
        `select *,orders.user_id from orders inner join 
        donation on orders.donation_id = donation.donation_id
        where orders.is_deleted = true and orders.user_id =$1`,
        [user_id]
      );
      if (!result.rowCount) {
        throw new Error("Order not found");
      }
      return result.rows;
    } catch (err) {
      throw err;
    }
  },
  getConfirmHistoryid: async (user_id, id) => {
    try {
      const result = await db.query(
        `select * from orders inner join 
        donation on orders.donation_id = donation.donation_id
        where orders.is_deleted = true and orders.user_id =$1 and orders.donation_id=$2`,
        [user_id, id]
      );
      if (!result.rowCount) {
        throw new Error("Order not found");
      }
      return result.rows;
    } catch (err) {
      throw err;
    }
  },
  getConfirmHistoryiddonate: async (user_id, id) => {
    try {
      const result = await db.query(
        `select * from orders inner join
        donation on orders.donation_id = donation.donation_id
        where orders.is_deleted = true and donation.user_id = $1 and orders.donation_id=$2`,
        [user_id, id]
      );
      if (!result.rowCount) {
        throw new Error("Order not found");
      }
      return result.rows;
    } catch (err) {
      throw err;
    }
  },
  getConfirmHistoryidorder: async (user_id, id) => {
    try {
      const result = await db.query(
        `select * from orders inner join
        donation on orders.donation_id = donation.donation_id
        where orders.is_deleted = true and orders.user_id =$1 and orders.donation_id=$2`,
        [user_id, id]
      );
      if (!result.rowCount) {
        throw new Error("Order not found");
      }
      return result.rows;
    } catch (err) {
      throw err;
    }
  },
};
