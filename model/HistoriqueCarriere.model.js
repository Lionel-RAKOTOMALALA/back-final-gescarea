import mongoose from "mongoose";

const { Schema } = mongoose;

// Définition du schéma HistoriqueCarriere
const HistoriqueCarriereSchema = new Schema({
    id_employe: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Employe",
        required: true
    },
    poste_et_fonction: {
        type: String,
        required: [true, "Please provide the position and function"],
        maxlength: [255, "Position and function cannot exceed 255 characters"]
    },
    date_debut_poste: {
        type: Date,
        required: [true, "Please provide the start date of the position"]
    },
    date_fin_poste: {
        type: Date,
        default: null
    },
    numero_decision: {
        type: String,
        required: [true, "Please provide the decision number"],
        maxlength: [255, "Decision number cannot exceed 255 characters"]
    },
    date_decision: {
        type: Date,
        required: [true, "Please provide the decision date"]
    },
    obs: {
        type: String,
        maxlength: [500, "Observations cannot exceed 500 characters"],
        default: null
    }
}, { timestamps: true });

export default mongoose.models.HistoriqueCarriere || mongoose.model('HistoriqueCarriere', HistoriqueCarriereSchema);
