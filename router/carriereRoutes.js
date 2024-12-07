import express from 'express';
import { ajouterEvenementCarriere } from '../controllers/carriereController.js';

const router = express.Router();

router.post('/ajouter', ajouterEvenementCarriere);

export default router;
