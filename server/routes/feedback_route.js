const { Router } = require("express");
const feedbackController = require("../controllers/feedback_controller");
const router = Router();
const verify = require("../middleware/authorizationJWT");

router.get("/getallfeedbacks", feedbackController.getfeedback);
router.post("/postfeedback", feedbackController.postfeedback);
router.get("/feedback/:id", feedbackController.feedbackid);
router.put("/deletefeedback/:id", feedbackController.deletefeedback);

module.exports = router;
