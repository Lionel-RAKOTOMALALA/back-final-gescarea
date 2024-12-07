import ServiceModel from "../model/Service.model.js";

// Ajouter un nouveau service
export const ajouterService = async (req, res) => {
    try {
        const { nom_service, antenne } = req.body;

        // Validation simple
        if (!nom_service) {
            return res.status(400).json({ error: "Le nom du service est obligatoire." });
        }

        // Création et sauvegarde du service
        const nouveauService = new ServiceModel({ nom_service, antenne });
        const serviceSauvegarde = await nouveauService.save();

        res.status(201).json({ message: "Service créé avec succès.", service: serviceSauvegarde });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Récupérer tous les services
export const recupererServices = async (req, res) => {
    try {
        const services = await ServiceModel.find();
        res.status(200).json(services);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Récupérer un service par ID
export const recupererServiceParId = async (req, res) => {
    try {
        const { id } = req.params;
        const service = await ServiceModel.findById(id);

        if (!service) {
            return res.status(404).json({ error: "Service non trouvé." });
        }

        res.status(200).json(service);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Mettre à jour un service
export const mettreAJourService = async (req, res) => {
    try {
        const { id } = req.params;
        const { nom_service, antenne } = req.body;

        const serviceMisAJour = await ServiceModel.findByIdAndUpdate(
            id,
            { nom_service, antenne },
            { new: true, runValidators: true } // Retourne le service mis à jour et valide les champs
        );

        if (!serviceMisAJour) {
            return res.status(404).json({ error: "Service non trouvé." });
        }

        res.status(200).json({ message: "Service mis à jour avec succès.", service: serviceMisAJour });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Supprimer un service
export const supprimerService = async (req, res) => {
    try {
        const { id } = req.params;

        const serviceSupprime = await ServiceModel.findByIdAndDelete(id);

        if (!serviceSupprime) {
            return res.status(404).json({ error: "Service non trouvé." });
        }

        res.status(200).json({ message: "Service supprimé avec succès." });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
