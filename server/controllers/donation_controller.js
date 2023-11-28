const donationmodel = require("../models/donation_model");
const firebase = require("../middleware/firebase.js");

// --------------------------------------------------get approved donation --------------------------------------

exports.getdonation = async (req, res) => {
  try {
    const result = await donationmodel.getDonation();
    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
// --------------------------------------------------get pending donation --------------------------------------

exports.getadminDonation = async (req, res) => {
  try {
    const result = await donationmodel.getadminDonation();
    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// --------------------------------------------------get not expired donation --------------------------------------

exports.getnotexpireddonation = async (req, res) => {
  try {
    const result = await donationmodel.getNotExpiredDonation();
    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// --------------------------------------------------get expired donation --------------------------------------

exports.getexpireddonation = async (req, res) => {
  try {
    const result = await donationmodel.getExpiredDonation();
    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// --------------------------------------------------post donation --------------------------------------

exports.postdonation = async (req, res) => {
  const {
    type,
    details,
    city,
    expiry_date,
    qty,
    free,
    expired,
    additionalnotes,
  } = req.body;
  // The user _id is available from the decoded JWT token
  const user_id = req.user.user_id;
  try {
    const file = req.file;
    if (file) {
      const fileName = `${Date.now()}_${file.originalname}`;

      const fileurl = await firebase.uploadFileToFirebase(file, fileName);

      req.body.imageurl = fileurl;
    }

    await donationmodel.postDonation(
      type,
      details,
      city,
      expiry_date,
      qty,
      user_id,
      free,
      expired,
      additionalnotes,
      req.body.imageurl
    );
    res.status(200).json({
      message: `Donation Created Sucessfully`,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// --------------------------------------------------post donation for business --------------------------------------

exports.postdonationbusiness = async (req, res) => {
  const {
    type,
    details,
    city,
    expiry_date,
    price,
    qty,
    free,
    expired,
    additionalnotes,
  } = req.body;
  const user_id = req.user.user_id;
  try {
    const file = req.file;
    if (file) {
      const fileName = `${Date.now()}_${file.originalname}`;

      const fileurl = await firebase.uploadFileToFirebase(file, fileName);

      req.body.imageurl = fileurl;
    }
    await donationmodel.postDonationBusiness(
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
      req.body.imageurl
    );
    res.status(200).json({
      message: `Donation Created Sucessfully`,
    });
  } catch (err) {
    console.error(err);
    res.status(404).json({ message: err.message });
  }
};
// --------------------------------------------------  repost donation --------------------------------------

exports.repostDonation = async (req, res) => {
  const {
    type,
    details,
    city,
    expiry_date,
    price,
    qty,
    free,
    expired,
    additionalnotes,
  } = req.body;
  const user_id = req.user.user_id;
  try {
    const file = req.file;
    if (file) {
      const fileName = `${Date.now()}_${file.originalname}`;

      const fileurl = await firebase.uploadFileToFirebase(file, fileName);

      req.body.imageurl = fileurl;
    }
    await donationmodel.repostDonation(
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
      req.body.imageurl
    );
    res.status(200).json({
      message: `Donation Reposted Sucessfully`,
    });
  } catch (err) {
    console.error(err);
    res.status(404).json({ message: err.message });
  }
};

// --------------------------------------------------get donation by id --------------------------------------

exports.getdonationid = async (req, res) => {
  const { id } = req.params;
  try {
    const donation = await donationmodel.getDonationById(id);
    res.json(donation);
  } catch (err) {
    console.error(err);
    res.status(404).json({ message: err.message });
  }
};

// --------------------------------------------------update donation --------------------------------------

exports.updatedonation = async (req, res) => {
  const { id } = req.params;
  const { type, details, city, expiry_date, price, qty, additionalnotes } =
    req.body;
  try {
    const file = req.file;
    if (file) {
      const fileName = `${Date.now()}_${file.originalname}`;

      const fileurl = await firebase.uploadFileToFirebase(file, fileName);

      req.body.imageurl = fileurl;
    }
    await donationmodel.updateDonation(
      id,
      type,
      details,
      city,
      expiry_date,
      price,
      qty,
      additionalnotes,
      req.body.imageurl
    );
    res.status(200).json({
      message: `Donation Updated Successfully`,
    });
  } catch (err) {
    console.error(err);
    res.status(404).json({ message: err.message });
  }
};

// --------------------------------------------------delete donation --------------------------------------

exports.deletedonation = async (req, res) => {
  const { id } = req.params;
  try {
    await donationmodel.deleteDonation(id);
    res.status(200).json({
      message: `Donation Deleted Successfully`,
    });
  } catch (err) {
    console.error(err);
    res.status(404).json({ message: err.message });
  }
};

// --------------------------------------------------count all donation  -----------------------------------------

exports.countdonation = async (req, res) => {
  try {
    const result = await donationmodel.countDonation();
    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// --------------------------------------------------approve donation --------------------------------------

exports.approvedonation = async (req, res) => {
  const { id } = req.params;
  try {
    await donationmodel.approveDonation(id);
    res.status(200).json({
      message: `Donation Approved Successfully`,
    });
  } catch (err) {
    console.error(err);
    res.status(404).json({ message: err.message });
  }
};

// --------------------------------------------------reject donation --------------------------------------

exports.rejectDonation = async (req, res) => {
  const { id } = req.params;
  try {
    await donationmodel.rejectDonation(id);
    res.status(200).json({
      message: `Donation Rejected Successfully`,
    });
  } catch (err) {
    console.error(err);
    res.status(404).json({ message: err.message });
  }
};

// --------------------------------------------------get donation by date --------------------------------------

exports.sortdateDonation = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    if (isNaN(page) || isNaN(limit) || page <= 0 || limit <= 0) {
      throw new Error("Invalid page or limit parameter");
    }
    const result = await donationmodel.sortdateDonation(page, limit);
    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// --------------------------------------------------get donation by user status --------------------------------------

exports.allDonation = async (req, res) => {
  const { status } = req.params;
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    if (isNaN(page) || isNaN(limit) || page <= 0 || limit <= 0) {
      throw new Error("Invalid page or limit parameter");
    }
    const result = await donationmodel.allDonation(status, page, limit);
    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
