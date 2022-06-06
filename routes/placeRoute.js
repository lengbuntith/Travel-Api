const { Router } = require("express");
const placeController = require("../controllers/placeController");
const router = Router();


router.get("/all", placeController.get_all);
router.get("/:id", placeController.get_id);
router.post("/create",placeController.create);
router.post("/update",placeController.update_by_id);
router.post("/delete",placeController.delete_by_id);

module.exports = router;