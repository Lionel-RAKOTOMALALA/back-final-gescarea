import mongoose from "mongoose";

const { Schema } = mongoose;

// Définition du schéma Decision
const DecisionSchema = new Schema({


    numero_decision: {
        type: String,
        required: [true, "Please provide the decision number"],
        unique: true
    },
    date_decision: {
        type: Date,
        required: [true, "Please provide the decision date"]
    },
    commentaire: {
        type: String,
        maxlength: [2000, "Comment cannot exceed 2000 characters"]
    },
    id_employe: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Employe',
        required: [true, "Please provide employee ID"]
    }
}, { timestamps: true });

export default mongoose.models.Decision || mongoose.model('Decision', DecisionSchema);

