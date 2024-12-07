import express from "express";
import {
    ajouterService,
    recupererServices,
    recupererServiceParId,
    mettreAJourService,
    supprimerService,
} from "../controllers/serviceController.js";

const router = express.Router();

// Route pour ajouter un nouveau service
router.post("/", ajouterService);

// Route pour récupérer tous les services
router.get("/", recupererServices);

// Route pour récupérer un service par ID
router.get("/:id", recupererServiceParId);

// Route pour mettre à jour un service
router.put("/:id", mettreAJourService);

// Route pour supprimer un service
router.delete("/:id", supprimerService);

export default router;
