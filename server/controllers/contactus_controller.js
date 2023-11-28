const contactmodel = require("../models/contactus_model");

// --------------------------------------------------get all contact --------------------------------------

exports.getcontact = async (req, res) => {
  try {
    const result = await contactmodel.getContacts();
    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// --------------------------------------------------post contact --------------------------------------

exports.postcontact = async (req, res) => {
  const { name, email, subject, message } = req.body;
  try {
    await contactmodel.postContact(name, email, subject, message);
    res.status(201).json({ message: `Your Message has been sent` });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// --------------------------------------------------get contact by id --------------------------------------

exports.contactid = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await contactmodel.getContactById(id);
    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(404).json({ message: err.message });
  }
};

// --------------------------------------------------delete contact --------------------------------------

exports.deletecontact = async (req, res) => {
  const { id } = req.params;
  try {
    await contactmodel.deleteContact(id);
    res.status(200).json({
      message: "Deleted Successfully",
    });
  } catch (err) {
    console.error(err);
    res.status(404).json({ message: err.message });
  }
};
