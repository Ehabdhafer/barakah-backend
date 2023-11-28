const { Router } = require("express");
const userController = require("../controllers/users_controller");
const router = Router();
const verify = require("../middleware/authorizationJWT");
const multer = require("multer");
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.post("/registration", userController.registerUser);
router.post("/login", userController.loginUser);
router.get("/alluser", userController.getUserDetails);
router.get(
  "/user",
  verify.authorize([1, 2, 3, 4, 5]),
  userController.getuserinfo
);
router.put(
  "/updateuser",
  verify.authorize([1, 2, 3, 4, 5]),
  upload.single("image"),
  userController.update_user
);
router.put("/updateuserrole/:user_id", userController.update_userrole);
router.put("/deleteuser/:user_id", userController.delete_user);
router.get("/countalluser", userController.countalluser);
router.get("/countusersub", userController.countusersub);

module.exports = router;
