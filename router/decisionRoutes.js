import express from 'express';
import { ajouterDecisionEtJournal } from '../controllers/decisionController.js';

const router = express.Router();

router.post('/ajouter', ajouterDecisionEtJournal);

export default router;
