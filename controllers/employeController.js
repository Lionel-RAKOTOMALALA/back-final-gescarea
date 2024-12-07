    import mongoose from 'mongoose';
    import Employe from '../model/Employe.model.js';
    import StatutEmploye from '../model/StatutEmploye.model.js';
    import AffectationEmploye from '../model/AffectationEmploye.model.js';
    import Diplome from '../model/Diplome.model.js';
    import Decision from '../model/Decision.model.js';
    import JournalDesActions from '../model/JournalDesActions.model.js';
    import Notification from '../model/Notification.model.js';
    import ServiceModel from '../model/Service.model.js';
    import {enregistrerActionEtNotification} from './utils/notification.js'       
import PosteModel from '../model/Poste.model.js';

// Ajouter un nouvel employé
export const ajouterNouvelEmploye = async (req, res) => {
    const { userId, username } = req.user; // Récupérer l'userId et le username de l'utilisateur connecté
    const { employe, statut, affectation, diplome, decision, posteId, serviceId } = req.body; // Utiliser posteId et serviceId directement
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        // Vérifier si le poste existe
        let posteData = null;
        if (posteId) {
            posteData = await PosteModel.findById(posteId).session(session);
            if (!posteData) {
                throw new Error("Le poste spécifié n'existe pas.");
            }
        }

        // Vérifier si le service existe
        let serviceData = null;
        if (serviceId) {
            serviceData = await ServiceModel.findById(serviceId).session(session);
            if (!serviceData) {
                throw new Error("Le service spécifié n'existe pas.");
            }
        }

        // Créer et sauvegarder l'employé avec les IDs de poste et de service
        const employeData = new Employe({
            ...employe,
            Poste_fonction: posteId, // Assigner l'ID du poste
            service: serviceId       // Assigner l'ID du service
        });
        await employeData.save({ session });

        // Créer et sauvegarder le statut de l'employé
        const statutData = new StatutEmploye({ ...statut, id_employe: employeData._id });
        await statutData.save({ session });

        // Ajouter l'ID de l'employé ainsi que les IDs de poste et de service à l'affectation avant de la sauvegarder
        const affectationData = new AffectationEmploye({
            ...affectation,
            id_employe: employeData._id, // Lier l'affectation à l'employé
            poste: posteId,              // Lier l'affectation au poste
            service: serviceId           // Lier l'affectation au service
        });
        await affectationData.save({ session });

        // Sauvegarder les informations de diplôme, si disponibles
        let diplomeData = null;
        if (diplome) {
            diplomeData = new Diplome({
                ...diplome,
                id_employe: employeData._id
            });
            await diplomeData.save({ session });
        }

        // Sauvegarder les informations de décision, si disponibles
        let decisionData = null;
        if (decision) {
            decisionData = new Decision({
                ...decision,
                id_employe: employeData._id
            });
            await decisionData.save({ session });
        }

        // Enregistrer l'action et la notification
        await enregistrerActionEtNotification(
            session,
            userId,
            `Ajout de l'employé ${employe.nom} par ${username}`,
            "Un nouvel employé a été ajouté."
        );

        // Valider la transaction
        await session.commitTransaction();

        // Construire le JSON de réponse
        const response = {
            employe: {
                ...employeData._doc, // Inclure les données de l'employé
            },
            statut: {
                ...statutData._doc, // Inclure les données du statut
            },
            affectation: {
                ...affectationData._doc, // Inclure les données de l'affectation
            },
            diplome: diplomeData ? { ...diplomeData._doc } : null, // Inclure les diplômes s'ils existent
            decision: decisionData ? { ...decisionData._doc } : null, // Inclure les décisions si elles existent
            poste: posteData ? { ...posteData._doc } : null, // Inclure les données du poste
            service: serviceData ? { ...serviceData._doc } : null // Inclure les données du service
        };

        // Répondre avec succès
        res.status(201).json(response);
    } catch (error) {
        // Annuler la transaction en cas d'erreur
        if (session.inTransaction()) {
            await session.abortTransaction();
        }
        res.status(500).json({ error: error.message });
    } finally {
        // Terminer la session
        session.endSession();
    }
};







    // Supprimer un employé avec toutes ses données associées
    export const supprimerEmploye = async (req, res) => {
        const { userId, username } = req.user; // Récupérer l'userId et le username de l'utilisateur connecté
        const { employeId } = req.params; // ID de l'employé à supprimer
        const session = await mongoose.startSession();
        session.startTransaction();

        try {
            // Récupérer l'employé à supprimer
            const employeData = await Employe.findById(employeId).session(session);
            if (!employeData) {
                return res.status(404).json({ error: "Employé non trouvé." });
            }

            // Supprimer les affectations liées à l'employé
            await AffectationEmploye.deleteMany({ id_employe: employeId }).session(session);

            // Supprimer les statuts liés à l'employé
            await StatutEmploye.deleteMany({ id_employe: employeId }).session(session);

            // Supprimer les diplômes liés à l'employé
            await Diplome.deleteMany({ id_employe: employeId }).session(session);

            // Supprimer les décisions liées à l'employé
            await Decision.deleteMany({ id_employe: employeId }).session(session);

            // Supprimer le poste et le service (si existants) uniquement si aucun autre employé n'y est affecté
            if (employeData.poste) {
                const posteId = employeData.poste;
                const posteCount = await Employe.countDocuments({ poste: posteId }).session(session);
                if (posteCount === 0) {
                    await PosteModel.findByIdAndDelete(posteId).session(session);
                }
            }

            if (employeData.service) {
                const serviceId = employeData.service;
                const serviceCount = await Employe.countDocuments({ service: serviceId }).session(session);
                if (serviceCount === 0) {
                    await ServiceModel.findByIdAndDelete(serviceId).session(session);
                }
            }

            // Supprimer l'employé
            await employeData.deleteOne({ session });

            // Enregistrer l'action et la notification
            await enregistrerActionEtNotification(
                session,
                userId,
                `Suppression de l'employé ${employeData.nom} par ${username}`,
                "L'employé a été supprimé avec succès."
            );

            // Valider la transaction
            await session.commitTransaction();
            
            // Répondre avec succès
            res.status(200).json({ message: "Employé supprimé avec succès." });
        } catch (error) {
            // Annuler la transaction en cas d'erreur
            if (session.inTransaction()) {
                await session.abortTransaction();
            }
            res.status(500).json({ error: error.message });
        } finally {
            // Terminer la session
            session.endSession();
        }
    };


    // Mettre à jour un employé
    export const mettreAJourEmploye = async (req, res) => {
        const { employeId } = req.params;
        const { userId, username } = req.user; // Récupérer l'userId et le username de l'utilisateur connecté
        const { employe, statut, affectation, diplome, decision, poste, service } = req.body; // Récupérer les données de la requête
        const session = await mongoose.startSession();
        session.startTransaction();

        try {
            // Récupérer l'employé existant
            const employeData = await Employe.findByIdAndUpdate(employeId, employe, { new: true, session });

            if (!employeData) {
                return res.status(404).json({ message: "Employé non trouvé" });
            }

            // Mettre à jour ou sauvegarder le poste, si disponible
            let posteId = employeData.poste; // Utiliser l'ID actuel du poste
            if (poste) {
                // Si un nouveau poste est fourni, mettre à jour l'existant ou créer un nouveau
                const posteData = await PosteModel.findById(posteId); // Chercher le poste existant
                if (posteData) {
                    // Mettre à jour le poste existant
                    await PosteModel.findByIdAndUpdate(posteId, poste, { session });
                } else {
                    // Créer un nouveau poste si aucun n'existe
                    const newPoste = new PosteModel(poste);
                    const savedPoste = await newPoste.save({ session });
                    posteId = savedPoste._id;
                }
            }

            // Mettre à jour ou sauvegarder le service, si disponible
            let serviceId = employeData.service; // Utiliser l'ID actuel du service
            if (service) {
                // Si un nouveau service est fourni, mettre à jour l'existant ou créer un nouveau
                const serviceData = await ServiceModel.findById(serviceId); // Chercher le service existant
                if (serviceData) {
                    // Mettre à jour le service existant
                    await ServiceModel.findByIdAndUpdate(serviceId, service, { session });
                } else {
                    // Créer un nouveau service si aucun n'existe
                    const newService = new ServiceModel(service);
                    const savedService = await newService.save({ session });
                    serviceId = savedService._id;
                }
            }

            // Mettre à jour le statut de l'employé
            await StatutEmploye.findOneAndUpdate({ id_employe: employeId }, statut, { new: true, session });

            // Mettre à jour l'affectation de l'employé
            await AffectationEmploye.findOneAndUpdate({ id_employe: employeId }, { 
                ...affectation,
                poste: posteId, // Lier l'affectation au poste
                service: serviceId // Lier l'affectation au service
            }, { new: true, session });

            // Mettre à jour les informations de diplôme, si disponibles
            if (diplome) {
                await Diplome.findOneAndUpdate({ id_employe: employeId }, diplome, { new: true, session });
            }

            // Mettre à jour les informations de décision, si disponibles
            if (decision) {
                await Decision.findOneAndUpdate({ id_employe: employeId }, decision, { new: true, session });
            }

            // Enregistrer l'action et la notification
            await enregistrerActionEtNotification(
                session,
                userId, // Passer l'ID de l'utilisateur connecté
                `Mise à jour de l'employé ${employe.nom} par ${username}`, // Action détaillée
                "Les informations de l'employé ont été mises à jour." // Message de notification
            );

            // Valider la transaction
            await session.commitTransaction();
            session.endSession();

            // Répondre avec succès
            res.status(200).json({ employe: employeData });
        } catch (error) {
            // Annuler la transaction en cas d'erreur
            await session.abortTransaction();
            session.endSession();
            res.status(500).json({ error: error.message });
        }
    };

    export const mettreAJourChampEmploye = async (req, res) => {
        const { employeId, columnId } = req.params;
        const newValue = req.body.value;

        console.log('columnId:', columnId);
        console.log('newValue:', newValue);

        try {
            const updateData = {};
            updateData[columnId] = newValue;

            const updatedEmploye = await Employe.findByIdAndUpdate(
                employeId,
                { $set: updateData },
                { new: true }
            );

            if (!updatedEmploye) {
                return res.status(404).json({ message: "Employé non trouvé" });
            }

            res.status(200).json({ employe: updatedEmploye });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    };


    // Obtenir les détails d'un employé
    export const obtenirDetailsEmploye = async (req, res) => {
        const { employeId } = req.params;

        try {
            // Récupérer les informations de l'employé
            const employe = await Employe.findById(employeId);
            if (!employe) {
                return res.status(404).json({ message: "Employé non trouvé", employeId });
            }

            // Récupérer les informations liées à cet employé
            const statutEmploye = await StatutEmploye.findOne({ id_employe: employeId });
            const affectationEmploye = await AffectationEmploye.findOne({ id_employe: employeId });
            const diplomesEmploye = await Diplome.find({ id_employe: employeId });
            const decisionsEmploye = await Decision.find({ id_employe: employeId });
            const posteEmploye = await PosteModel.findOne({ _id: employe.poste });
            const serviceEmploye = await ServiceModel.findOne({ _id: employe.service });

            // Construire la réponse avec toutes les données
            const employeDetails = {
                employe,
                statut: statutEmploye,
                affectation: affectationEmploye,
                diplome: diplomesEmploye,
                decision: decisionsEmploye,
                poste: posteEmploye,  // Poste de l'employé
                service: serviceEmploye // Service de l'employé
            };

            // Envoyer la réponse avec toutes les données liées à l'employé
            res.status(200).json(employeDetails);
        } catch (error) {
            // En cas d'erreur, envoyer une réponse d'erreur
            res.status(500).json({ error: error.message });
        }
    };


    export const obtenirTousLesEmployes = async (req, res) => {
        try {
            // Récupérer tous les employés
            const employes = await Employe.find();
    
            // Utiliser `Promise.all` pour exécuter toutes les requêtes en parallèle
            const employeDetails = await Promise.all(
                employes.map(async (employe) => {
                    // Récupérer les détails associés pour chaque employé
                    const [statutEmploye, affectationEmploye, diplomesEmploye, decisionsEmploye, posteEmploye, serviceEmploye] = await Promise.all([
                        StatutEmploye.findOne({ id_employe: employe._id }),
                        AffectationEmploye.findOne({ id_employe: employe._id }),
                        Diplome.find({ id_employe: employe._id }),
                        Decision.find({ id_employe: employe._id }),
                        PosteModel.findOne({ _id: employe.Poste_fonction }),
                        ServiceModel.findOne({ _id: employe.service }),
                    ]);
    
                    // Retourner les détails formatés pour cet employé
                    return {
                        employe,
                        statut: statutEmploye,
                        affectation: affectationEmploye,
                        diplomes: diplomesEmploye,
                        decisions: decisionsEmploye,
                        poste: posteEmploye,
                        service: serviceEmploye,
                    };
                })
            );
    
            // Envoyer la réponse avec les détails de tous les employés
            res.status(200).json(employeDetails);
        } catch (error) {
            // En cas d'erreur, envoyer une réponse d'erreur
            res.status(500).json({ error: error.message });
        }
    };
    

    // Afficher tous les employés
    export const afficherTousLesEmployes = async (req, res) => {
        try {
            // Récupérer la liste de tous les employés
            const employes = await Employe.find();

            // Vérifier si des employés existent
            if (!employes || employes.length === 0) {
                return res.status(404).json({ message: 'Aucun employé trouvé' });
            }

            // Pour chaque employé, récupérer les informations associées
            const employeDetails = await Promise.all(employes.map(async (employe) => {
                const statut = await StatutEmploye.findOne({ id_employe: employe._id });
                const affectation = await AffectationEmploye.findOne({ id_employe: employe._id });
                const diplome = await Diplome.findOne({ id_employe: employe._id });
                const decision = await Decision.findOne({ id_employe: employe._id });

                // Retourner les détails de chaque employé
                return {
                    employe,
                    statut,
                    affectation,
                    diplome,
                    decision,
                };
            }));

            // Répondre avec les détails des employés
            res.status(200).json(employeDetails);
        } catch (error) {
            // En cas d'erreur, retourner une erreur 500 avec le message d'erreur
            res.status(500).json({ error: error.message });
        }
    };

    // Récupérer la liste d'affectations d'un employé, triée par date
    export const afficherTousLesEmployesAvecAffectationsTriees = async (req, res) => {
        try {
            // Récupérer la liste de tous les employés
            const employes = await Employe.find();

            // Vérifier si des employés existent
            if (!employes || employes.length === 0) {
                return res.status(404).json({ message: 'Aucun employé trouvé' });
            }

            // Pour chaque employé, récupérer les informations associées
            const employeDetails = await Promise.all(employes.map(async (employe) => {
                const affectations = await AffectationEmploye.find({ id_employe: employe._id })
                    .sort({ date_prise_service: 1 }); // Tri par date de prise de service

                const diplome = await Diplome.findOne({ id_employe: employe._id });
                const decision = await Decision.findOne({ id_employe: employe._id });

                // Retourner les détails de chaque employé avec les affectations triées
                return {
                    employe,
                    affectations: affectations.length > 0 ? affectations : null,
                    diplome: diplome || null,
                    decision: decision || null,
                };
            }));

            // Trier les employés par la date de prise de service de la première affectation
            const employeDetailsTriees = employeDetails.sort((a, b) => {
                const dateA = a.affectations ? a.affectations[0].date_prise_service : new Date(0);
                const dateB = b.affectations ? b.affectations[0].date_prise_service : new Date(0);
                return dateA - dateB;
            });

            // Retourner les détails des employés avec leurs affectations triées
            res.status(200).json(employeDetailsTriees);
        } catch (error) {
            // Gérer les erreurs en renvoyant un message d'erreur
            res.status(500).json({ error: error.message });
        }
    };
