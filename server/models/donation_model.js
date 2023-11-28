// models/donationModel.js
const db = require("./db");

module.exports = {
  getDonation: async () => {
    const query = `select * , donation.city from donation 
    inner join users on donation.user_id = users.user_id
    where donation.is_deleted = false and donation.status = 'approved' `;
    const result = await db.query(query);
    return result.rows;
  },
  getadminDonation: async () => {
    const query = `select * from donation 
    inner join users on donation.user_id = users.user_id
    where donation.is_deleted = false and donation.status = 'pending' `;
    const result = await db.query(query);
    return result.rows;
  },
  getNotExpiredDonation: async () => {
    const date = new Date();
    const query = `select * from donation 
    inner join users on donation.user_id = users.user_id
    where donation.is_deleted = false and expiry_date > $1`;
    const result = await db.query(query, [date]);
    return result.rows;
  },

  getExpiredDonation: async () => {
    const date = new Date();
    const query = `
    select * from donation 
    inner join users on donation.user_id = users.user_id
    where donation.is_deleted = false and expiry_date < $1`;
    const result = await db.query(query, [date]);
    return result.rows;
  },

  postDonation: async (
    type,
    details,
    city,
    expiry_date,
    qty,
    user_id,
    free,
    expired,
    additionalnotes,
    imageurl
  ) => {
    const query = `insert into donation (type, details, city, date, time, expiry_date, user_id, qty,free,expired,additionalnotes,imageurl)
    values ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12)
    `;
    const date = new Date();
    const time = new Date().toLocaleTimeString("en-US", {
      hour12: false,
    });
    const values = [
      type,
      details,
      city,
      date,
      time,
      expiry_date,
      user_id,
      qty,
      free,
      expired,
      additionalnotes,
      imageurl,
    ];
    await db.query(query, values);
  },

  postDonationBusiness: async (
    type,
    details,
    city,
    expiry_date,
    price,
    qty,
    user_id,
    free,
    expired,
    additionalnotes,
    imageurl
  ) => {
    const subscriptionQuery = `SELECT subscription FROM users WHERE user_id = $1 `;
    const subscriptionResult = await db.query(subscriptionQuery, [user_id]);

    if (
      subscriptionResult.rows.length > 0 &&
      subscriptionResult.rows[0].subscription
    ) {
      const query = `insert into donation (type, details, city, date, time, expiry_date, price, user_id, qty,free,expired,additionalnotes,imageurl)
    values ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13)
    `;
      const date = new Date();
      const time = new Date().toLocaleTimeString("en-US", {
        hour12: false,
      });
      const values = [
        type,
        details,
        city,
        date,
        time,
        expiry_date,
        price,
        user_id,
        qty,
        free,
        expired,
        additionalnotes,
        imageurl,
      ];
      await db.query(query, values);
    } else {
      throw new Error("User is not subscribed. Cannot post a new donation.");
    }
  },

  repostDonation: async (
    type,
    details,
    city,
    expiry_date,
    price,
    qty,
    user_id,
    free,
    expired,
    additionalnotes,
    imageurl
  ) => {
    const subscriptionQuery = `SELECT subscription FROM users WHERE user_id = $1 `;
    const subscriptionResult = await db.query(subscriptionQuery, [user_id]);

    if (
      subscriptionResult.rows.length > 0 &&
      subscriptionResult.rows[0].subscription
    ) {
      const query = `insert into donation (type, details, city, date, time, expiry_date, price, user_id, qty,free,expired,additionalnotes,imageurl,status)
    values ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14)
    `;
      const status = "approved";
      const date = new Date();
      const time = new Date().toLocaleTimeString("en-US", {
        hour12: false,
      });
      const values = [
        type,
        details,
        city,
        date,
        time,
        expiry_date,
        price,
        user_id,
        qty,
        free,
        expired,
        additionalnotes,
        imageurl,
        status,
      ];
      await db.query(query, values);
    } else {
      throw new Error("User is not subscribed. Cannot post a new donation.");
    }
  },

  getDonationById: async (id) => {
    const donation = await db.query(
      `select * from donation 
      inner join users on donation.user_id = users.user_id 
      where donation_id = $1 and donation.is_deleted = false`,
      [id]
    );
    if (!donation.rowCount) {
      throw new Error("Donation not found");
    } else {
      return donation.rows;
    }
  },

  updateDonation: async (
    id,
    type,
    details,
    city,
    expiry_date,
    price,
    qty,
    additionalnotes,
    imageurl
  ) => {
    const query = `update donation set type=COALESCE($1,type), details=COALESCE($2,details), city=COALESCE($3,city),
     expiry_date=COALESCE($4,expiry_date),price=COALESCE($5,price), qty=COALESCE($6,qty), additionalnotes=COALESCE($8,additionalnotes), 
     imageurl=COALESCE($9,imageurl) where donation_id=$7 and is_deleted = false`;
    const values = [
      type,
      details,
      city,
      expiry_date,
      price,
      qty,
      id,
      additionalnotes,
      imageurl,
    ];
    const donation = await db.query(query, values);
    if (!donation.rowCount) {
      throw new Error("Donation not found");
    }
  },

  deleteDonation: async (id) => {
    const query = `update donation set is_deleted = true where donation_id =$1`;
    const donation = await db.query(query, [id]);
    if (!donation.rowCount) {
      throw new Error("Donation not found");
    }
  },

  countDonation: async () => {
    const query = `select count(*) from donation where is_deleted = false`;
    const result = await db.query(query);
    return result.rows;
  },
  approveDonation: async (id) => {
    const query = `update donation set status = 'approved' where donation_id =$1`;
    const donation = await db.query(query, [id]);
    if (!donation.rowCount) {
      throw new Error("Donation not found");
    }
  },
  rejectDonation: async (id) => {
    const query = `update donation set is_deleted = true , status = 'rejected' where donation_id =$1`;
    const donation = await db.query(query, [id]);
    if (!donation.rowCount) {
      throw new Error("Donation not found");
    }
  },
  sortdateDonation: async (page, limit) => {
    if (page <= 0 || limit <= 0) {
      throw new Error("Invalid page or limit parameter");
    }
    const offset = (page - 1) * limit;
    const query = `select * from donation 
    inner join users on donation.user_id = users.user_id
    where donation.is_deleted = false 
	  order by date DESC LIMIT $1 OFFSET $2 `;
    const result = await db.query(query, [limit, offset]);
    return result.rows;
  },
  allDonation: async (status, page, limit) => {
    if (page <= 0 || limit <= 0) {
      throw new Error("Invalid page or limit parameter");
    }
    const offset = (page - 1) * limit;
    const query = `select * from donation 
    inner join users on donation.user_id = users.user_id
    where donation.is_deleted = false and donation.status = $1 
    order by donation.donation_id LIMIT $2 OFFSET $3`;
    const result = await db.query(query, [status, limit, offset]);
    return result.rows;
  },
};
