import mongoose from "mongoose";

const { Schema } = mongoose;

// Définition du schéma StatutEmploye
export const StatutEmployeSchema = new Schema({
    id_employe: {
        type: Schema.Types.ObjectId, // Référence vers l'employé (clé étrangère)
        ref: 'Employe', // Référence à la collection Employe
        required: [true, "Employee ID is required"] // Validation de la FK
    },
    code_cadre: {
        type: String,
        required: [true, "Please provide cadre code"], // Champ obligatoire
        maxlength: [50, "Cadre code cannot exceed 50 characters"] // Limitation de la taille
    },
    qualite: {
        type: String,
        required: [true, "Please provide employee quality"], // Champ obligatoire
        maxlength: [255, "Quality cannot exceed 255 characters"] // Limitation de la taille
    },
    categorie: {
        type: String,
        required: [true, "Please provide employee category"], // Champ obligatoire
        maxlength: [50, "Category cannot exceed 50 characters"] // Limitation de la taille
    },
    corps: {
        type: String,
        required: [true, "Please provide employee corps"], // Champ obligatoire
        maxlength: [50, "Corps cannot exceed 50 characters"] // Limitation de la taille
    },
    grade: {
        type: String,
        required: [true, "Please provide employee grade"], // Champ obligatoire
        maxlength: [50, "Grade cannot exceed 50 characters"] // Limitation de la taille
    },
    indice: {
        type: String,
        required: [true, "Please provide employee indice"], // Champ obligatoire
    },
    situation_non_encadres: {
        type: String,
        maxlength: [255, "Non-encadre situation cannot exceed 255 characters"], // Limitation de la taille
    },
    structure: {
        type: String,
        required: [true, "Please provide employee structure"], // Champ obligatoire
        maxlength: [255, "Structure cannot exceed 255 characters"] // Limitation de la taille
    },
    En_activite_aupres_srsp: {
        type: String,
        required: [true, "Please provide activity status"], // Champ obligatoire
        enum: ["OUI", "DEPART", "ARRIVE"], // Valeurs autorisées
        default: "OUI", // Valeur par défaut
    },
    dateDerniereSituation: {
        type: Date,
        required: [true, "Please provide the last situation date"],
    }
    
}, { timestamps: true }); // Ajoute createdAt et updatedAt automatiquement

export default mongoose.models.StatutEmploye || mongoose.model('StatutEmploye', StatutEmployeSchema);
