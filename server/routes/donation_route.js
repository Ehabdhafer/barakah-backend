const { Router } = require("express");
const donationController = require("../controllers/donation_controller");
const router = Router();
const verify = require("../middleware/authorizationJWT");
const multer = require("multer");
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.get("/getdonation", donationController.getdonation);
router.get("/getadmindonation", donationController.getadminDonation);
router.get("/getnotexpireddonation", donationController.getnotexpireddonation);
router.get("/getexpireddonation", donationController.getexpireddonation);
router.post(
  "/postdonation",
  upload.single("image"),
  verify.authorize([1, 2, 3]),
  donationController.postdonation
);
router.post(
  "/postdonationbusiness",
  upload.single("image"),
  verify.authorize([1, 2, 3]),
  donationController.postdonationbusiness
);
router.post(
  "/repostdonation",
  upload.single("image"),
  verify.authorize([1, 2, 3]),
  donationController.repostDonation
);
router.get("/donation/:id", donationController.getdonationid);
router.put(
  "/updatedonation/:id",
  upload.single("image"),
  donationController.updatedonation
);
router.put("/deletedonation/:id", donationController.deletedonation);
router.get("/countdonation", donationController.countdonation);
router.put("/approvedonation/:id", donationController.approvedonation);
router.put("/rejectDonation/:id", donationController.rejectDonation);
router.get("/sortdonation", donationController.sortdateDonation);
router.get("/alldonation/:status", donationController.allDonation);

module.exports = router;
