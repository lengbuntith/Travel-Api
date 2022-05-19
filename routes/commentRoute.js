const { Router } = require("express");
const commentController = require("../controllers/commentController");

const router = Router();

router.get("/:item_id", commentController.get_by_item);
router.post("/create", commentController.create);
router.post("/update/:id");
router.post("/delete/:id");

module.exports = router;
