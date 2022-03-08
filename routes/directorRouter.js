const Router = require("express").Router;
const router = Router();
const directorController = require("../controllers/directorController");

router.get("/getmagazin", directorController.getmagazin);
router.post("/createMagazine", directorController.createMagazine);
router.get("/countDressNeedSend", directorController.countDressNeedSend);
router.get("/getCountProduct", directorController.getCountProduct);

module.exports = router;
