const { Router } = require("express");
const paymentController = require("../controllers/payment_controller");
const stripeController = require("../controllers/stripe_controller");
const router = Router();
const verify = require("../middleware/authorizationJWT");

router.post(
  "/cardcheck",
  verify.authorize([1, 2, 3]),
  paymentController.card_check
);
router.get("/paymentdata", paymentController.paymentdata);
router.post(
  "/subscribtion",
  verify.authorize([1, 2, 3]),
  stripeController.createCheckoutSession
);

module.exports = router;
