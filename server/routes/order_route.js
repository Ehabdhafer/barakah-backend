const { Router } = require("express");
const orderController = require("../controllers/order_controller");
const router = Router();
const verify = require("../middleware/authorizationJWT");

// verify.authorize([1]);
// verify.authorize([1, 2, 3, 4, 5]),

router.get("/getallorder", orderController.getorder);
router.post(
  "/postorder",
  verify.authorize([1, 2, 3, 4, 5]),
  orderController.postorder
);
// router.get("/getorder/:id", orderController.getorderid);
router.get(
  "/getorderid",
  verify.authorize([1, 2, 3, 4, 5]),
  orderController.getorderid
);
router.put("/updateorder/:id", orderController.updateorder);
router.put("/deleteorder/:id", orderController.deleteorder);
// router.get("/getorderhistory/:id", orderController.getorderhistory);

module.exports = router;
