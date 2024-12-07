import mongoose from "mongoose";

const { Schema } = mongoose;

// Définition du schéma AffectationEmploye
const AffectationEmployeSchema = new Schema({
    id_employe: {
        type: Schema.Types.ObjectId,
        ref: 'Employe',
        required: true
    },
    poste: {
        type: Schema.Types.ObjectId,
        ref: 'Poste',
        required: true
    },
    date_entree_admin: {
        type: Date,
        required: [true, "Please provide the entry date to administration"]
    },
    date_prise_service: {
        type: Date,
        required: [true, "Please provide the service start date"]
    },
    lieu_affectation: {
        type: String,
        required: [true, "Please provide the place of assignment"],
        maxlength: [255, "Place of assignment cannot exceed 255 characters"]
    },
    motif_depart_arrivee: {
        type: String,
        required: [true, "Please provide the reason for departure or arrival"],
        maxlength: [500, "Reason cannot exceed 500 characters"]
    },
    direction_srsp: {
        type: String,
        maxlength: [255, "Direction or SRSP cannot exceed 255 characters"]
    }
}, { timestamps: true });


export default mongoose.models.AffectationEmploye || mongoose.model('AffectationEmploye', AffectationEmployeSchema);

