import 'dotenv/config';
// import dotenv from 'dotenv';
import express from 'express';
import appointmentRoutes from './routes/appointmentRoutes.js';

// configuration
// dotenv.config();

// Initialization

const app = express();
const port = process.env.PORT || 3000;

// Middleware

app.use(express.json());

// routes

app.use('/api', appointmentRoutes);

app.get('/', (req,res) => {
    res.status(200).send("AI Appointment Scheduler API is running!");
});

// server startup

app.listen(port, () => {
    console.log(`Server is listening on http://localhost:${port}`);
});
