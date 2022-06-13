const { Router } = require("express");
const { requireAuth } = require("../middleware/authMiddleware");
const commentController = require("../controllers/commentController");

const router = Router();

router.get("/detail/:place_id", commentController.get_by_item);
router.post("/create", requireAuth, commentController.create);
router.post("/delete/:comment_id", requireAuth, commentController.delete);

module.exports = router;
