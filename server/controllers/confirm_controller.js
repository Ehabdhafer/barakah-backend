const confirmmodel = require("../models/confirm_model");

// --------------------------------------------------post confirm order --------------------------------------

exports.postconfirm = async (req, res) => {
  const user_iddonation = req.user.user_id;
  const { order_id, accept_location, phone, collectionTime } = req.body;
  try {
    await confirmmodel.postConfirmOrder(
      order_id,
      accept_location,
      phone,
      user_iddonation,
      collectionTime
    );
    res.status(200).json({
      message: `Order Confirmed Successfully`,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// --------------------------------------------------get confirm order --------------------------------------

exports.getconfirm = async (req, res) => {
  try {
    const result = await confirmmodel.getConfirmedOrders();
    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// --------------------------------------------------get confirm order by id --------------------------------------

exports.getconfirmid = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await confirmmodel.getConfirmedOrderById(id);
    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(404).json({ message: err.message });
  }
};

// --------------------------------------------------delete confirm order by id --------------------------------------

exports.deleteconfirm = async (req, res) => {
  const { id } = req.params;
  try {
    await confirmmodel.deleteConfirmedOrder(id);
    res.status(200).json({
      message: `Order Deleted Successfully`,
    });
  } catch (err) {
    console.error(err);
    res.status(404).json({ message: err.message });
  }
};

// --------------------------------------------------- confirm order history ----------------------------------------------------

exports.getHistory = async (req, res) => {
  const user_id = req.user.user_id;
  try {
    const result = await confirmmodel.getConfirmHistory(user_id);
    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(404).json({ message: err.message });
  }
};
// --------------------------------------------------- confirm order history by id ----------------------------------------------------

exports.getHistoryid = async (req, res) => {
  const user_id = req.user.user_id;
  const { id } = req.params;
  try {
    const result = await confirmmodel.getConfirmHistoryid(user_id, id);
    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(404).json({ message: err.message });
  }
};
