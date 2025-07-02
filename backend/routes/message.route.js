import express from "express";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import { getConversationUsers, getMessage, sendMessage } from "../controllers/message.controller.js";

const router = express.Router();

router.route('/send/:id').post(isAuthenticated, sendMessage);
router.route('/all/:id').get(isAuthenticated, getMessage);
router.route('/conversations/:id').get(isAuthenticated, getConversationUsers);

export default router;