const Router = require("express").Router;
const router = Router();
const vendorController = require("../controllers/vendorController");
const authMiddleWare = require("../middleware/authMiddleware");

router.get("/test", vendorController.test);
router.post("/createDress", authMiddleWare, vendorController.createDress);
router.post("/getDress", vendorController.getDress);
router.post("/getDressMag", vendorController.getDressMag);
router.post("/createSalon", vendorController.createSalon);
router.get("/getSalonList", vendorController.getSalonList);
router.post("/createSale", authMiddleWare, vendorController.createSale);
router.get("/getAllSales", vendorController.getAllSales);
router.get("/dress/:id", vendorController.dressById);

module.exports = router;
