require("dotenv").config();
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const usermodel = require("../models/user_model");

exports.createCheckoutSession = async (req, res) => {
  try {
    const user_id = req.user.user_id;

    const checkoutObject = {
      payment_method_types: ["card"],
      line_items: [
        {
          price: "price_1OH1zsKdeTW7uN6XhmHWuHRS",
          quantity: 1,
        },
      ],
      mode: "subscription",
    };

    const customer = await stripe.customers.create({
      email: req.user.email,
      name: req.user.username,
      metadata: {
        user_id: user_id,
      },
    });

    const session = await stripe.checkout.sessions.create({
      customer: customer.id,
      success_url: "https://localhost:3000/success",
      cancel_url: "https://localhost:3000/cancel",
      line_items: checkoutObject.line_items,
      mode: checkoutObject.mode,
      subscription_data: checkoutObject.subscription_data,
    });

    await usermodel.subscribe(user_id);
    res.json({ id: session.id });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, error: "Payment failed" });
  }
};
