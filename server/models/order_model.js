const db = require("./db");

module.exports = {
  getOrders: async () => {
    try {
      const query = `select * from orders inner join donation on 
      orders.donation_id = donation.donation_id
      where orders.is_deleted = false`;
      const result = await db.query(query);
      return result.rows;
    } catch (err) {
      throw err;
    }
  },

  postOrder: async (order_city, phone, donation_id, user_id) => {
    try {
      const query = `insert into orders (order_city, phone, user_id, donation_id,order_time)
      values ($1,$2,$3,$4,$5)
      `;
      const order_time = new Date();
      const values = [order_city, phone, user_id, donation_id, order_time];
      await db.query(query, values);
    } catch (err) {
      throw err;
    }
  },

  getOrderByUserId: async (id) => {
    try {
      const result = await db.query(
        `select users.username,users.industry,donation.type, orders.order_id
      FROM orders
      INNER JOIN donation ON orders.donation_id = donation.donation_id
      INNER JOIN users ON orders.user_id = users.user_id
      where orders.is_deleted = false and donation.user_id =$1 and donation.is_deleted = false`,
        [id]
      );
      if (!result.rowCount) {
        throw new Error("Order not found");
      }
      return result.rows;
    } catch (err) {
      throw err;
    }
  },

  updateOrder: async (id, order_city, phone) => {
    try {
      const query = `update orders 
      set order_city=COALESCE($1,order_city), phone=COALESCE($2,phone) where order_id=$3 and is_deleted = false`;
      const values = [order_city, phone, id];
      const result = await db.query(query, values);
      if (!result.rowCount) {
        throw new Error("Order not found");
      }
    } catch (err) {
      throw err;
    }
  },

  deleteOrder: async (id) => {
    try {
      const query = `update orders set is_deleted = true where order_id =$1`;
      const result = await db.query(query, [id]);
      if (!result.rowCount) {
        throw new Error("Order not found");
      }
    } catch (err) {
      throw err;
    }
  },
};
