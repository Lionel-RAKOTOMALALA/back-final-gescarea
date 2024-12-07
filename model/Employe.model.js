import mongoose from "mongoose";

const { Schema } = mongoose; // Extraire Schema depuis mongoose




// Définition du schéma Employe
export const EmployeSchema = new Schema({
    username: {
        type: String,
        required: [true, "Please provide unique username"],
        unique: [true, "Username Exist"]
    },
    password: {
        type: String,
        required: [true, "Please provide password"],
        minlength: [8, "Password must be at least 8 characters long"]
    },
    email: {
        type: String,
        required: [true, "Please provide valid email"],
        unique: [true, "Email already registered"],
        match: [/\S+@\S+\.\S+/, "Please provide a valid email address"]
    },
    prenom: {
        type: String,
        required: true
    },
    nom: {
        type: String,
        required: true
    },
    date_naissance: {
        type: Date,
        required: true
    },
    age: {
        type: Number,
        required: true
    },
    genre: {
        type: String,
        enum: ['M', 'F'],
        required: true
    },
    situation_matrimoniale: {
        type: String,
        enum: ['Célibataire', 'Marié(e)', 'Divorcé(e)', 'Veuf(ve)'],
        required: true
    },
    contact_personnel: {
        type: String,
        match: [/\d{10}/, "Please provide a valid 10-digit personal contact"],
        required: true
    },
    contact_flotte: {
        type: String,
        match: [/\d{10}/, "Please provide a valid 10-digit flotte contact"],
        required: true
    },
    profile: {
        type: String,
    },
    adresse: {
        type: String,
        required: true
    }, 
    service: {
        type: Schema.Types.ObjectId,
        ref: 'Service',  // Référence au modèle Service
        required: true  // Indique qu'un employé doit obligatoirement être affecté à un service
    },   
    Poste_fonction: {
        type: Schema.Types.ObjectId,
        ref: "PosteModel"
    },
});

export default mongoose.models.Employe || mongoose.model('Employe', EmployeSchema);