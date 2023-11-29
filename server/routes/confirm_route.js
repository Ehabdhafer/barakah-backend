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
  "/getconfirmhistorydonate",
  verify.authorize([1, 2, 3, 4, 5]),
  confirmController.getConfirmHistorydonate
);
router.get(
  "/getconfirmhistoryorder",
  verify.authorize([1, 2, 3, 4, 5]),
  confirmController.getConfirmHistoryorder
);
router.get(
  "/getconfirmhistory/:id",
  verify.authorize([1, 2, 3, 4, 5]),
  confirmController.getHistoryid
);
router.get(
  "/getconfirmhistorydonate/:id",
  verify.authorize([1, 2, 3, 4, 5]),
  confirmController.getConfirmHistoryiddonate
);
router.get(
  "/getconfirmhistoryorder/:id",
  verify.authorize([1, 2, 3, 4, 5]),
  confirmController.getConfirmHistoryidorder
);

module.exports = router;
