const Router = require("express").Router;
const router = Router();
const wareHouseController = require("../controllers/wareHouseController");

router.post("/registerProduct", wareHouseController.registerProduct);
router.get("/getProducts", wareHouseController.getProducts);
router.post("/addProduct", wareHouseController.addProduct);
router.post("/useProduct", wareHouseController.useProduct);

module.exports = router;
