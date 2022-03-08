const Router = require("express").Router;
const router = Router();
const supplierController = require("../controllers/supplierController");

router.get("/needSend", supplierController.getAllSales);
router.post("/delivered", supplierController.delivered);

module.exports = router;
