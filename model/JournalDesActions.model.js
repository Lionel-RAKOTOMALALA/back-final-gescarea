import mongoose from "mongoose";

const { Schema } = mongoose;

// Définition du schéma JournalDesActions
const JournalDesActionsSchema = new Schema({
    id_log: {
        type: String,
        default: () => new mongoose.Types.ObjectId().toString(), // Génère un ID unique si non fourni
        unique: true // Assurez-vous que l'ID est unique
    },
    id_utilisateur: {
    type: mongoose.Schema.Types.ObjectId, // Référence à l'utilisateur (gestionnaire) avec ObjectId
    ref: 'User', // Référence au modèle User
    required: [true, "Veuillez fournir l'ID de l'utilisateur."]
},
    action: {
    type: String,
    required: [true, "Veuillez fournir une description de l'action."],
    maxlength: [255, "La description de l'action ne peut pas dépasser 255 caractères."]
},
    date_action: {
    type: Date,
    required: [true, "Veuillez fournir la date de l'action."]
},
    details: {
    type: String, // Utilisation de String pour des détails supplémentaires
    maxlength: [1000, "Les détails ne peuvent pas dépasser 1000 caractères."]
}
}, { timestamps: true });  // Ajout des timestamps pour suivi des créations et mises à jour

export default mongoose.models.JournalDesActions || mongoose.model('JournalDesActions', JournalDesActionsSchema);
