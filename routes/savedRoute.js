const { Router } = require("express");
const { requireAuth } = require("../middleware/authMiddleware");
const savedController = require("../controllers/savedController");

const router = Router();

router.get("/me", requireAuth, savedController.get_by_user);
router.post("/place/:id", requireAuth, savedController.get_by_place);
// router.post("/delete/:id", requireAuth, savedController.delete_by_id);
router.post("/add", savedController.create);
// router.post("/add", requireAuth, savedController.add);

module.exports = router;