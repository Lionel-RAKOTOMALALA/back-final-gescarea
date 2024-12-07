import mongoose from "mongoose";

const { Schema } = mongoose;

// Définition du schéma Poste
const PosteSchema = new Schema({

    titre_poste: {
        type: String,  // Titre du poste
        required: [true, "Please provide the job title"],
        maxlength: [255, "Job title cannot exceed 255 characters"]
    },
    description_poste: {
        type: String,  // Description des responsabilités liées au poste
        required: [true, "Please provide the job description"],
        maxlength: [2000, "Job description cannot exceed 2000 characters"]  // Limitation arbitraire
    },
    departement: {
        type: String,  // Département où se trouve le poste
        required: [true, "Please provide the department"],
        maxlength: [255, "Department name cannot exceed 255 characters"]
    },
    salaire_min: {
        type: Number,  // Salaire minimum pour le poste
        required: [true, "Please provide the minimum salary"],
        min: [0, "Minimum salary must be a positive number"]
    },
    salaire_max: {
        type: Number,  // Salaire maximum pour le poste
        required: [true, "Please provide the maximum salary"],
        min: [0, "Maximum salary must be a positive number"]
    },
    effectifs_a_pourvoir: {
        type: Number,  // Effectifs à pourvoir pour ce poste
        required: [true, "Please provide the number of positions available"],
        min: [1, "There must be at least one position available"]
    }
}, { timestamps: true });  // Ajout de createdAt et updatedAt automatiquement

export default mongoose.models.Poste || mongoose.model('Poste', PosteSchema);
