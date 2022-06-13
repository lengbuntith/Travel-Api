const { Router } = require("express");
const { requireAuth } = require("../middleware/authMiddleware");
const commentController = require("../controllers/commentController");

const router = Router();

router.get("/detail/:place_id", commentController.get_by_item);
router.post("/create", requireAuth, commentController.create);
router.post("/update/:id");
router.post("/delete/:id");

module.exports = router;
