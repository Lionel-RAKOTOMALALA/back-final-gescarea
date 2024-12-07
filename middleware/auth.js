import jwt from 'jsonwebtoken';
import ENV from '../config.js';

export default async function Auth(req, res, next) {
    try {
        // Accéder à l'en-tête Authorization pour valider la requête
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ error: "Authentication failed...!" });
        }

        // Extraire uniquement le token sans le préfixe 'Bearer '
        const token = authHeader.split(' ')[1];

        // Vérifier le token avec la clé secrète
        const decodedToken = await jwt.verify(token, ENV.JWT_SECRET);

        // Ajouter les informations décodées de l'utilisateur à la requête
        req.user = decodedToken;

        // Passer au middleware suivant
        next();
    } catch (error) {
        return res.status(401).json({ error: "Authentication failed...!", message: error.message });
    }
}


export function localVariables(req, res, next){
    req.app.locals = {
        OTP : null,
        resetSession : false
    }
    next();
}