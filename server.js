import express from 'express';
import morgan from 'morgan';
import connect from './database/conn.js';
import router from './router/route.js';
import employeRoutes from './router/employeRoutes.js';
import carriereRoutes from './router/carriereRoutes.js';
import decisionRoutes from './router/decisionRoutes.js';
import posteRoutes from './router/posteRoutes.js';
import serviceRoutes from './router/serviceRoutes.js'
import cors from 'cors';

const app = express();

/** middleware */
app.use(express.json({ limit: '10mb' }));  // Utiliser express.json() avec une limite
app.use(express.urlencoded({ limit: '10mb', extended: true }));  // Utiliser express.urlencoded() pour les données d'URL encodées

/** CORS Configuration */
app.use(cors());
app.use(morgan('tiny'));
app.disable('x-powered-by');

const port = 8000;

/** HTTP Get Request */
app.get('/', (req, res) => {
    res.status(201).json("HOME GET Request");
});

/** api routes */
app.use('/api', router);
app.use('/api/employes', employeRoutes);
app.use('/api/carrieres', carriereRoutes);
app.use('/api/decisions', decisionRoutes);
app.use("/api/postes", posteRoutes);
app.use("/api/services", serviceRoutes);

/** Start server only and connect database */
connect().then(() => {
    try {
        app.listen(port, () => {
            console.log(`Server connected to http://localhost:${port}`);
        });
    } catch (error) {
        console.log('Cannot connect to the server');
    }
}).catch(error => {
    console.log("Invalid database connection...!");
});
