const Router = require("express").Router;
const router = Router();
const authController = require("../controllers/authController");
const { check } = require("express-validator");
const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

router.post(
  "/registration",
  [
    check("username", "username pustoy bolmasin").notEmpty(),
    check("password", "Parol 4dan kop bolishi kerak").isLength({ min: 3 }),
  ],
  authController.registration
);
router.post("/login", authController.login);
router.get("/users", authMiddleware, authController.getUsers);
// router.get("/users", roleMiddleware(["USER"]), authController.getUsers);
router.post("/createRole", authController.createRole);

module.exports = router;
