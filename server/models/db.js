const { Pool } = require("pg");

const pool = new Pool({
  user: "Ehab",
  password: "1234",
  host: "localhost",
  port: 5432,
  database: "Barakah",
});

module.exports = {
  query: (text, params) => pool.query(text, params),
};
