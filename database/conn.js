import mongoose from "mongoose";
import ENV from '../config.js';

async function connect(){
    mongoose.set('strictQuery', true);
    
    // Connexion à MongoDB Atlas
    const db = await mongoose.connect(ENV.ATLAS_URI, { useNewUrlParser: true, useUnifiedTopology: true });
    
    console.log("Database Connected");
    
    return db;
}

export default connect;
