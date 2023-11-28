const paymentmodel = require("../models/payment_model");

exports.card_check = async (req, res) => {
  const {
    number,
    month,
    year,
    cvc,
    order_id,
    payment_amount,
    payment_method,
    cardname,
  } = req.body;
  const user_id = req.user.user_id;

  try {
    const checked = await paymentmodel.checkCard(number, month, year, cvc);

    if (!checked.length) {
      res.status(400).json({ error: "Invalid Card Data" });
    } else {
      const card = checked[0];

      if (payment_amount > card.balance) {
        res.status(400).json({ error: "Insufficient balance" });
      } else {
        const payment_id = await paymentmodel.createPayment(
          user_id,
          order_id,
          payment_amount,
          payment_method,
          card.card_id,
          cardname
        );
        await paymentmodel.updateCardBalance(card.card_id, payment_amount);
        await paymentmodel.updateUserSubscription(user_id);

        res.status(200).json({
          message: "Subscribed Successfully",
          payment_id: payment_id,
        });
      }
    }
  } catch (err) {
    console.error(err);
    res.status(500).send("Failed to Check");
  }
};

// ----------------------------------------------------------------------------------------

exports.paymentdata = async (req, res) => {
  try {
    const pay = await paymentmodel.getPayments();
    res.json(pay);
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
};

// ----------------------------------------------------------------------------------------------
