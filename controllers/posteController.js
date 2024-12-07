import PosteModel from "../model/Poste.model.js";

// Créer un nouveau poste
export const createPoste = async (req, res) => {
    try {
        const poste = new PosteModel(req.body); // Créer une instance du modèle Poste avec les données de la requête
        const savedPoste = await poste.save(); // Sauvegarder le poste dans la base de données
        return res.status(201).json({
            success: true,
            message: "Poste créé avec succès",
            data: savedPoste,
        });
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: "Erreur lors de la création du poste",
            error: error.message,
        });
    }
};

// Récupérer tous les postes
export const getAllPostes = async (req, res) => {
    try {
        const postes = await PosteModel.find(); // Récupérer tous les postes
        return res.status(200).json({
            success: true,
            message: "Postes récupérés avec succès",
            data: postes,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Erreur lors de la récupération des postes",
            error: error.message,
        });
    }
};

// Récupérer un poste par ID
export const getPosteById = async (req, res) => {
    try {
        const poste = await PosteModel.findById(req.params.id); // Chercher un poste par son ID
        if (!poste) {
            return res.status(404).json({
                success: false,
                message: "Poste introuvable",
            });
        }
        return res.status(200).json({
            success: true,
            message: "Poste récupéré avec succès",
            data: poste,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Erreur lors de la récupération du poste",
            error: error.message,
        });
    }
};

// Mettre à jour un poste par ID
export const updatePosteById = async (req, res) => {
    try {
        const updatedPoste = await PosteModel.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true } // Retourne le poste mis à jour, valide les données
        );
        if (!updatedPoste) {
            return res.status(404).json({
                success: false,
                message: "Poste introuvable",
            });
        }
        return res.status(200).json({
            success: true,
            message: "Poste mis à jour avec succès",
            data: updatedPoste,
        });
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: "Erreur lors de la mise à jour du poste",
            error: error.message,
        });
    }
};

// Supprimer un poste par ID
export const deletePosteById = async (req, res) => {
    try {
        const deletedPoste = await PosteModel.findByIdAndDelete(req.params.id); // Supprimer un poste par son ID
        if (!deletedPoste) {
            return res.status(404).json({
                success: false,
                message: "Poste introuvable",
            });
        }
        const postes = await PosteModel.find(); // Supprimer un poste par son ID

        return res.status(200).json({
            success: true,
            message: "Poste supprimé avec succès",
            postes: postes,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Erreur lors de la suppression du poste",
            error: error.message,
        });
    }
};
