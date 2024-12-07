    import UserModel from "../model/User.model.js";
    import bcrypt from 'bcrypt';
    import jwt from 'jsonwebtoken'; // Importation correcte pour les modules CommonJS
    import ENV from '../config.js';
    import otpGenerator from 'otp-generator';
    import { registerMail } from './mailer.js';
    
import Employe from '../model/Employe.model.js';
import StatutEmploye from '../model/StatutEmploye.model.js';
import AffectationEmploye from '../model/AffectationEmploye.model.js';
import Diplome from '../model/Diplome.model.js';
import Decision from '../model/Decision.model.js';
import PosteModel from "../model/Poste.model.js";



   

    /** middleware for verify user */
    export async function verifyUser(req, res, next) {
        try {
            const { username } = req.method == "GET" ? req.query : req.body;

            //check  the user existance
            let exist = await Employe.findOne({ username });
            if (!exist) return res.status(404).send({ error: "Can't find User!" });
            next();
        } catch (error) {
            return res.status(404).send({ error: "Authentication Error" });
        }
    }
    export async function register(req, res) {
        try {
            const { username, password, profile, email } = req.body;

            // Vérifier l'existence de l'utilisateur
            const existUsername = await UserModel.findOne({ username });
            if (existUsername) {
                return res.status(400).json({ error: "Please use a unique username" });
            }

            // Vérifier l'existence de l'email
            const existEmail = await UserModel.findOne({ email });
            if (existEmail) {
                return res.status(400).json({ error: "Please use a unique email" });
            }

            // Hachage du mot de passe et création de l'utilisateur
            if (password) {
                const hashedPassword = await bcrypt.hash(password, 10);

                const user = new UserModel({
                    username,
                    password: hashedPassword,
                    profile: profile || '',
                    email
                });

                // Enregistrer l'utilisateur et retourner la réponse
                await user.save();
                return res.status(201).send({ msg: "User registered successfully" });
            } else {
                return res.status(400).send({ error: "Password is required" });
            }

        } catch (error) {
            return res.status(500).send({ error: error.message });
        }
    }
    export async function login(req, res) {
        const { username, password } = req.body;
    
        try {
            const user = await Employe.findOne({ username });
            if (!user) {
                return res.status(404).send({ error: "Username not found" });
            }
    
            const passwordCheck = await bcrypt.compare(password, user.password);
            if (!passwordCheck) {
                // Retourner à la fois l'username et l'erreur
                return res.status(400).send({ 
                    username: user.username,
                    error: "Password does not match" 
                });
            }
    
            const token = jwt.sign({
                userId: user._id,
                username: user.username,
                email: user.email
            }, ENV.JWT_SECRET, { expiresIn: "24h" });
    
            return res.status(200).send({
                msg: "Login Successful...!",
                username: user.username,
                token
            });
    
        } catch (error) {
            return res.status(500).send({ error: error.message });
        }
    }
    


    export async function getUser(req, res) {
        const { username } = req.params;
    
        try {
            // Rechercher l'employé par username de manière insensible à la casse
            const employe = await Employe.findOne({ username: { $regex: new RegExp(`^${username}$`, 'i') } });
    
            if (!employe) {
                return res.status(404).json({ message: "Employé non trouvé" });
            }
    
            // Récupérer les informations liées à cet employé
            const statutEmploye = await StatutEmploye.findOne({ id_employe: employe._id });
            const affectationEmploye = await AffectationEmploye.findOne({ id_employe: employe._id });
            const diplomesEmploye = await Diplome.find({ id_employe: employe._id });
            const decisionsEmploye = await Decision.find({ id_employe: employe._id });
            const posteEmploye = await PosteModel.findById(employe.id_poste); // Assurez-vous que `id_poste` est le champ correct
    
            // Construire la réponse avec toutes les données
            const employeDetails = {
                employe,
                statut: statutEmploye,
                affectation: affectationEmploye,
                diplomes: diplomesEmploye,
                decisions: decisionsEmploye,
                poste: posteEmploye // Inclure les détails du poste
            };
    
            // Envoyer la réponse avec toutes les données liées à l'employé
            res.status(200).json(employeDetails);
        } catch (error) {
            // En cas d'erreur, envoyer une réponse d'erreur
            res.status(500).json({ error: error.message });
        }
    }
    
    




    export async function updateUser(req, res) {
        try {
            // const id = req.query.id;
            const { userId } = req.user;

            if (userId) {
                const body = req.body;

                // Utilisation d'async/await pour updateOne sans callback
                const result = await UserModel.updateOne({ _id: userId }, body);
                

                if (result.matchedCount === 0) {
                    return res.status(404).send({ error: "User Not Found...!" });
                }

                return res.status(200).send({ msg: "Record updated...!" });
            } else {
                return res.status(400).send({ error: "No ID provided...!" });
            }
        } catch (error) {
            return res.status(500).send({ error: error.message || "An error occurred" });
        }
    }


    export async function generateOTP(req,res){
        req.app.locals.OTP = await otpGenerator.generate(6, { lowerCaseAlphabets: false, upperCaseAlphabets: false, specialChars: false})
        res.status(201).send({ code: req.app.locals.OTP })
    }
    export async function verifyOPT(req, res) {
        const { code } = req.query;
        if (parseInt(req.app.locals.OTP) === parseInt(code)) {
            req.app.locals.OTP = null; //reset the OTP value
            req.app.locals.resetSession = true; // start the session for reset password
            return res.status(201).send({ msg: 'Verify successfully!!' })
        }
        return res.status(400).send({ error: "Invalid OTP" });
    }

    export async function createResetSession(req, res) {
        if (req.app.locals.resetSession) {
            return res.status(201).send({ flag: req.app.locals.resetSession });
        }
        return res.status(440).send({ error: "Session expired!" });
    }

    export async function resetPassword(req, res) {

        try {
            if (!req.app.locals.resetSession) return res.status(440).send({ error: "Session expired!" });
            
            const { username, password } = req.body;
            
            try {
                const user = await UserModel.findOne({ username });
                if (!user) {
                    return res.status(404).send({ error: "Username Not Found" });
                }
                
                const hashedPassword = await bcrypt.hash(password, 10);
                
                await UserModel.updateOne({ username: user.username }, { password: hashedPassword },);
                
                return res.status(200).send({ msg: "Password reset successfully!" });
                
            } catch (error) {
                return res.status(400).send({ error: error.message || "An error occurred during password reset" });
            }

        } catch (error) {
            return res.status(500).send({ error: error.message || "An error occurred while resetting password" });
        }
    }
