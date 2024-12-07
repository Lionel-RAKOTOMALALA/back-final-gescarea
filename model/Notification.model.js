import mongoose from "mongoose";

const { Schema } = mongoose;

export const NotificationSchema = new Schema({
    id_notification: {
        type: String,
        default: () => new mongoose.Types.ObjectId().toString(), // Génère un ID unique si non fourni
        unique: true // Assurez-vous que l'ID est unique
    },
    id_utilisateur: {
        type: mongoose.Schema.Types.ObjectId, // Référence à l'utilisateur avec ObjectId
        ref: 'User', // Référence au modèle User
        required: false // Champ nullable
    },
    type_alerte: {
        type: String,
        required: [true, "Please provide alert type"],
        maxlength: [50, "Alert type cannot exceed 50 characters"]
    },
    message_alerte: {
        type: String,
        required: [true, "Please provide alert message"]
    },
    date_creation: {
        type: Date,
        required: [true, "Please provide creation date"],
        default: Date.now // Définit la date de création par défaut à la date actuelle
    },
    est_vue: {
        type: Boolean,
        default: false // Statut par défaut à non vue
    }
}, { timestamps: true });  // Ajout des timestamps pour le suivi des créations et mises à jour


export default mongoose.models.Notification || mongoose.model('Notification', NotificationSchema);
