const { Router } = require("express");
const router = Router();
const commentSuggestController = require("../controllers/commentSuggestController");
const { requireAuth } = require("../middleware/authMiddleware");

router.post("/create", requireAuth, commentSuggestController.create);
router.get("/get/:id", commentSuggestController.get_by_suggest);

module.exports = router;