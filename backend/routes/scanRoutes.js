import express from "express";
import { scanTarget } from "../controllers/scanController.js";
import { identifyUser } from "../middleware/authMiddleware.js"; // IMPORT NEW MIDDLEWARE

const router = express.Router();

// APPLY identifyUser SO THE CONTROLLER KNOWS IF WE ARE LOGGED IN
router.post("/", identifyUser, scanTarget);

export default router;