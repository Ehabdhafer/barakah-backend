const db = require("./db");
const bcrypt = require("bcrypt");

module.exports = {
  getUserDetails: async (page, limit) => {
    try {
      if (page <= 0 || limit <= 0) {
        throw new Error("Invalid page or limit parameter");
      }
      const offset = (page - 1) * limit;
      const user = await db.query(
        `SELECT * FROM users WHERE is_deleted = false order by user_id LIMIT $1 OFFSET $2 `,
        [limit, offset]
      );
      return user.rows;
    } catch (err) {
      throw err;
    }
  },

  getUserInfo: async (user_id) => {
    try {
      const user = await db.query(
        `select * from users where user_id = $1 and is_deleted = false`,
        [user_id]
      );
      return user.rows;
    } catch (err) {
      throw err;
    }
  },

  updateUser: async (
    user_id,
    username,
    email,
    phone,
    city,
    oldpassword,
    password,
    imageurl
  ) => {
    try {
      const storedUser = await db.query(
        "SELECT * FROM users WHERE user_id = $1",
        [user_id]
      );

      if (password) {
        const storedHashedPassword = storedUser.rows[0].password;
        const matched_password = await bcrypt.compare(
          oldpassword,
          storedHashedPassword
        );

        if (!matched_password) {
          throw new Error("Old password is incorrect");
        }

        const hashedNewPassword = await bcrypt.hash(password, 10);

        updateQuery = `UPDATE users SET 
          username = COALESCE($2, username),
          email = COALESCE($3, email),
          phone = COALESCE($4, phone),
          city = COALESCE($5, city),
          password = COALESCE($6, password),
          imageurl = COALESCE($7, imageurl)
          WHERE user_id = $1 AND is_deleted = false RETURNING user_id`;

        params = [
          user_id,
          username,
          email,
          phone,
          city,
          hashedNewPassword,
          imageurl,
        ];
      } else {
        updateQuery = `UPDATE users SET 
          username = COALESCE($2, username),
          email = COALESCE($3, email),
          phone = COALESCE($4, phone),
          city = COALESCE($5, city),
          imageurl = COALESCE($6, imageurl)
          WHERE user_id = $1 AND is_deleted = false RETURNING user_id`;

        params = [user_id, username, email, phone, city, imageurl];
      }

      await db.query(updateQuery, params);

      return { message: "User details updated successfully" };
    } catch (err) {
      throw new Error("Failed to update user details", err);
    }
  },

  deleteUser: async (user_id) => {
    try {
      const storedUser = await db.query(
        "SELECT * FROM users WHERE user_id = $1",
        [user_id]
      );

      if (!storedUser.rows.length) {
        throw new Error("User not found");
      }

      const updateQuery = `UPDATE users SET is_deleted = true WHERE user_id = $1 RETURNING user_id`;

      await db.query(updateQuery, [user_id]);

      return { message: "User details deleted successfully" };
    } catch (err) {
      console.error(err);
      throw err;
    }
  },
  countSubscribedUsers: async () => {
    try {
      const query = `SELECT COUNT(*) FROM users WHERE subscription = true AND is_deleted = false`;
      const result = await db.query(query);
      return result.rows;
    } catch (err) {
      throw err;
    }
  },
  countAllUsers: async () => {
    try {
      const query = `SELECT COUNT(*) FROM users WHERE is_deleted = false`;
      const result = await db.query(query);
      return result.rows;
    } catch (err) {
      throw err;
    }
  },
  getUserById: async (user_id) => {
    const userQuery = "SELECT * FROM users WHERE user_id = $1";
    const user = await db.query(userQuery, [user_id]);
    return user.rows[0];
  },
  updateUserRole: async (user_id, role_id) => {
    const updateQuery = `UPDATE users SET role_id = $2
      WHERE user_id = $1 AND is_deleted = false RETURNING user_id`;

    await db.query(updateQuery, [user_id, role_id]);
  },
  getUserByEmail: async (email) => {
    const userQuery = "SELECT * FROM users WHERE email = $1";
    const user = await db.query(userQuery, [email]);
    return user.rows[0];
  },
  createUser: async ({
    username,
    email,
    password,
    city,
    phone,
    role_id,
    created_at,
    industry,
  }) => {
    const userQuery = `
      INSERT INTO users (username, email, password, city, phone, role_id, created_at, industry)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING user_id, username, email, role_id`;

    const values = [
      username,
      email,
      password,
      city,
      phone,
      role_id,
      created_at,
      industry,
    ];
    const user = await db.query(userQuery, values);

    return user.rows[0];
  },
  subscribe: async (user_id) => {
    const userQuery = "update users set subscription = true WHERE user_id = $1";
    const user = await db.query(userQuery, [user_id]);
    return user.rows[0];
  },
};
