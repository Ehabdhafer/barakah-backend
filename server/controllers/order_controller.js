const ordermodel = require("../models/order_model");

// --------------------------------------------------get all orders --------------------------------------

exports.getorder = async (req, res) => {
  try {
    const result = await ordermodel.getOrders();
    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// --------------------------------------------------post order --------------------------------------

exports.postorder = async (req, res) => {
  const { order_city, phone, donation_id } = req.body;
  const user_id = req.user.user_id;

  try {
    await ordermodel.postOrder(order_city, phone, donation_id, user_id);
    res.status(200).json({
      message: `Order Created Successfully`,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

// --------------------------------------------------get order by user_id --------------------------------------

exports.getorderid = async (req, res) => {
  const user_id = req.user.user_id;
  try {
    const result = await ordermodel.getOrderByUserId(user_id);
    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(404).json({ message: err.message });
  }
};

// --------------------------------------------------update order --------------------------------------

exports.updateorder = async (req, res) => {
  const { id } = req.params;
  const { order_city, phone } = req.body;
  try {
    await ordermodel.updateOrder(id, order_city, phone);
    res.status(200).json({
      message: `Order Updated Successfully`,
    });
  } catch (err) {
    console.error(err);
    res.status(404).json({ message: err.message });
  }
};

// // --------------------------------------------------delete order --------------------------------------

exports.deleteorder = async (req, res) => {
  const { id } = req.params;
  try {
    await ordermodel.deleteOrder(id);
    res.status(200).json({
      message: `Order Deleted Successfully`,
    });
  } catch (err) {
    console.error(err);
    res.status(404).json({ message: err.message });
  }
};

// ------------------------------------------------- Order History ----------------------------

// exports.getorderhistory = async (req, res) => {
//   const { id } = req.params;
//   try {
// const result = await ordermodel.getOrderHistory(id);
//     res.json(result);
//   } catch (err) {
//     console.error(err);
//     res.status(404).json({ message: err.message });
//   }
// };
