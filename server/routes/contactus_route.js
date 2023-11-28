const { Router } = require("express");
const contactcontroller = require("../controllers/contactus_controller");
const router = Router();
const verify = require("../middleware/authorizationJWT");

router.get("/getcontact", contactcontroller.getcontact);
router.post("/postcontact", contactcontroller.postcontact);
router.get("/contactid/:id", contactcontroller.contactid);
router.put("/deletecontact/:id", contactcontroller.deletecontact);

module.exports = router;
