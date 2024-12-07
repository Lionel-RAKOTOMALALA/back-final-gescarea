import nodemailer from 'nodemailer';
import Mailgen from 'mailgen';
import ENV from '../config.js'; 

// Configuration pour Gmail
let nodeConfig = {
    service: 'gmail',
    auth: {
        user: ENV.EMAIL, 
        pass: ENV.PASSWORD, 
    }
}

// Création du transporteur Nodemailer avec la config Gmail
let transporter = nodemailer.createTransport(nodeConfig);

// Générateur d'email avec Mailgen
let mailGenerator = new Mailgen({
    theme: "default",
    product: {
        name: "Mailgen",
        link: "https://mailgen.js/",
    }
})

// Fonction pour envoyer l'email de confirmation
// Fonction pour envoyer l'email de confirmation
export const registerMail = async (req, otp = null) => {
    const { username, userEmail, text, subject } = req.body;

    try {
        // Corps de l'email
        var email = {
            body: {
                name: username,
                intro: text || "Bienvenue sur Mailgen ! Voici votre OTP :",
            }
        }

        var emailBody = mailGenerator.generate(email);

        let message = {
            from: ENV.EMAIL, // Adresse email d'envoi (Gmail)
            to: userEmail, // Utilisez `userEmail` venant du front
            subject: subject || "OTP pour votre demande",
            html: emailBody
        }

        // Envoi de l'email
        await transporter.sendMail(message);
        console.log("Email envoyé avec succès !");
    } catch (error) {
        console.error("Erreur lors de l'envoi de l'email:", error);
        throw new Error("Erreur lors de l'envoi de l'email");
    }
}
