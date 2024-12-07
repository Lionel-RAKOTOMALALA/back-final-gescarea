import express from "express";
import {
    createPoste,
    getAllPostes,
    getPosteById,
    updatePosteById,
    deletePosteById,
} from '../controllers/posteController.js';


const router = express.Router();

router.post("/", createPoste);
router.get("/", getAllPostes);
router.get("/:id", getPosteById);
router.put("/:id", updatePosteById);
router.delete("/:id", deletePosteById);

export default router;
