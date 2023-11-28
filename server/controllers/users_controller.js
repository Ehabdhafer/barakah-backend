const userModel = require("../models/user_model");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
require("dotenv").config();
// const crypto = require("crypto");
const Joi = require("joi");
const firebase = require("../middleware/firebase.js");

// const secretKey1 = crypto.randomBytes(32).toString("hex");
// console.log(secretKey1);
// --------------------------------------------------Registration-------------------------------------------------------------

exports.registerUser = async (req, res) => {
  const { username, email, password, city, phone, role_id, industry } =
    req.body;
  const created_at = new Date();

  try {
    const schema = Joi.object({
      username: Joi.string().min(3).max(20).required(),
      email: Joi.string()
        .email({ minDomainSegments: 2, tlds: { allow: ["com", "net"] } })
        .required(),
      password: Joi.string()
        .pattern(
          new RegExp(
            "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@#$%^&!])[A-Za-z\\d@#$%^&!]{6,30}$"
          )
        )
        .required(),
      phone: Joi.string()
        .pattern(/^[0-9]{7,12}$/)
        .required(),
    });
    const validate = schema.validate({
      username,
      email,
      password,
      phone,
    });
    if (validate.error) {
      res.status(405).json({ error: validate.error.details });
    } else {
      const existingUser = await userModel.getUserByEmail(email);

      if (existingUser) {
        return res.status(400).json({ error: "Email already exists" });
      } else {
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await userModel.createUser({
          username,
          email,
          password: hashedPassword,
          city,
          phone,
          role_id,
          created_at,
          industry,
        });

        const payload = {
          username: user.username,
          email: user.email,
          role_id: user.role_id,
          user_id: user.user_id,
        };

        const secretKey = process.env.SECRET_KEY;
        const token = jwt.sign(payload, secretKey, { expiresIn: "1h" });

        res.status(201).json({
          message: "User Added Successfully",
          token: token,
        });
      }
    }
  } catch (err) {
    console.error(err);
    res.status(500).send("Failed to add user");
  }
};

// ------------------------------------------------------Login---------------------------------------------------------
exports.loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await userModel.getUserByEmail(email);

    if (!user) {
      res.status(400).json({ error: "Invalid Email" });
    } else {
      const storedHashedPassword = user.password;
      const matched_password = await bcrypt.compare(
        password,
        storedHashedPassword
      );
      if (!matched_password) {
        res.status(400).json({ message: "password is invalid" });
        return;
      }
      const payload = {
        username: user.username,
        email: user.email,
        role_id: user.role_id,
        user_id: user.user_id,
      };
      const secretKey = process.env.SECRET_KEY;
      const token = jwt.sign(payload, secretKey, { expiresIn: "1h" });

      res.status(200).json({
        message: "Login Successfully",
        token: token,
      });
    }
  } catch (err) {
    console.error(err);
    res.status(500).send("Failed to Authenticate");
  }
};
// ----------------------------------------------------------------all user details-----------------------------------------------
exports.getUserDetails = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    if (isNaN(page) || isNaN(limit) || page <= 0 || limit <= 0) {
      throw new Error("Invalid page or limit parameter");
    }
    const userDetails = await userModel.getUserDetails(page, limit);
    res.json(userDetails);
  } catch (err) {
    console.error(err.message);
    res.status(500).send(err.message);
  }
};
// ----------------------------------------------------------------selected user details-----------------------------------------------
exports.getuserinfo = async (req, res) => {
  const user_id = req.user.user_id;
  try {
    const userInfo = await userModel.getUserInfo(user_id);
    res.json(userInfo);
  } catch (err) {
    console.error(err.message);
    res.status(500).send(err.message);
  }
};

// ---------------------------------------------------------------- update user info --------------------------------------------

exports.update_user = async (req, res) => {
  const user_id = req.user.user_id;
  const { username, email, phone, city, oldpassword, password } = req.body;

  try {
    const file = req.file;
    if (file) {
      const fileName = `${Date.now()}_${file.originalname}`;

      const fileurl = await firebase.uploadFileToFirebase(file, fileName);

      req.body.imageurl = fileurl;
    }
    const schema = Joi.object({
      username: Joi.string().min(3).max(20),
      email: Joi.string().email({
        minDomainSegments: 2,
        tlds: { allow: ["com", "net"] },
      }),
      phone: Joi.string().pattern(/^[0-9]{7,12}$/),
      password: Joi.string().pattern(
        new RegExp(
          "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@#$%^&!])[A-Za-z\\d@#$%^&!]{6,30}$"
        )
      ),
    });
    const validate = schema.validate({
      username,
      email,
      phone,
      password,
    });
    if (validate.error) {
      res.status(405).json({ error: validate.error.details });
    } else {
      const result = await userModel.updateUser(
        user_id,
        username,
        email,
        phone,
        city,
        oldpassword,
        password,
        req.body.imageurl
      );

      res.status(200).json(result);
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).send(err.message);
  }
};

// ---------------------------------------------------------------- delete user by id --------------------------------------------

exports.delete_user = async (req, res) => {
  const { user_id } = req.params;
  try {
    const result = await userModel.deleteUser(user_id);
    res.status(200).json(result);
  } catch (err) {
    console.error(err.message);
    res.status(500).send(err.message);
  }
};

// --------------------------------------------------count users subscibed -----------------------------------------

exports.countusersub = async (req, res) => {
  try {
    const count = await userModel.countSubscribedUsers();
    res.json(count);
  } catch (err) {
    console.error(err.message);
    res.status(500).send(err.message);
  }
};
// --------------------------------------------------count all users  -----------------------------------------

exports.countalluser = async (req, res) => {
  try {
    const count = await userModel.countAllUsers();
    res.json(count);
  } catch (err) {
    console.error(err.message);
    res.status(500).send(err.message);
  }
};

// --------------------------------------------------update user role ---------------------------------------------

exports.update_userrole = async (req, res) => {
  const { user_id } = req.params;
  const { role_id } = req.body;

  try {
    const user = await userModel.getUserById(user_id);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    await userModel.updateUserRole(user_id, role_id);

    res.status(200).json({
      message: "User role updated successfully",
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Failed to update user role");
  }
};
