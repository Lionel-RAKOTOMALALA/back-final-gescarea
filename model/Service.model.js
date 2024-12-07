import mongoose from "mongoose";

const { Schema } = mongoose;

export const ServiceSchema = new Schema({

    nom_service: {
        type: String,
        required: [true, "Please provide service name"],
    },
    antenne: {
        type: String,
    }
});

export default mongoose.models.Service || mongoose.model('Service', ServiceSchema);
