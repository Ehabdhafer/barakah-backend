const { Router } = require("express");
const confirmController = require("../controllers/confirm_controller.js");
const router = Router();
const verify = require("../middleware/authorizationJWT");

router.post(
  "/postconfirm",
  verify.authorize([1, 2, 3, 4, 5]),
  confirmController.postconfirm
);
router.get("/getconfirm", confirmController.getconfirm);
router.get("/getconfirm/:id", confirmController.getconfirmid);
router.put("/deleteconfirm/:id", confirmController.deleteconfirm);
router.get(
  "/getconfirmhistory",
  verify.authorize([1, 2, 3, 4, 5]),
  confirmController.getHistory
);
router.get(
  "/getconfirmhistory/:id",
  verify.authorize([1, 2, 3, 4, 5]),
  confirmController.getHistoryid
);

module.exports = router;
