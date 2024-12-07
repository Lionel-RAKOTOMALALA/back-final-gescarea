import express from 'express';
import { ajouterNouvelEmploye,obtenirDetailsEmploye,obtenirTousLesEmployes, mettreAJourEmploye, supprimerEmploye, mettreAJourChampEmploye  } from '../controllers/employeController.js';
import Auth from '../middleware/auth.js';
const router = express.Router();

router.post('/ajouter', Auth, ajouterNouvelEmploye);

// Route pour afficher toutes les données liées à un employé
router.get('/:employeId', Auth,obtenirDetailsEmploye);
// Route pour afficher tout les employés
router.get('/', obtenirTousLesEmployes);
// Route pour afficher tout les employés
// router.get('/employeAffectDate/:', afficherTousLesEmployesAvecAffectationsTriees);

router.put('/:employeId',Auth, mettreAJourEmploye );

router.put('/:employeId/:columnId', Auth,mettreAJourChampEmploye);

router.delete('/:employeId',Auth, supprimerEmploye); 
export default router;
