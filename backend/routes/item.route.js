import express from "express";
import { protect } from '../middleware/authMiddleware.js';
import {getItems, createItem, updateItem, deleteItem} from "../controllers/item.controller.js";

const router = express.Router();

router.get("/user", protect, getItems);

router.post("/", protect, createItem);

router.put("/:id", updateItem);

router.delete("/:id", deleteItem);

export default router;