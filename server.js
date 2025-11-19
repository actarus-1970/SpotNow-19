import express from 'express';
import cors from 'cors';
import { GoogleGenAI } from '@google/genai';
import zonesRouter from './server/routes/zones.js';
import stallsRouter from './server/routes/stalls.js';
import parkingSpotsRouter from './server/routes/parkingSpots.js';
import usersRouter from './server/routes/users.js';
import tariffsRouter from './server/routes/tariffs.js';
import permissionsRouter from './server/routes/permissions.js';
import subscriptionsRouter from './server/routes/subscriptions.js';
import transactionsRouter from './server/routes/transactions.js';
import vehicleChecksRouter from './server/routes/vehicleChecks.js';
import vehiclesRouter from './server/routes/vehicles.js';
import paymentMethodsRouter from './server/routes/paymentMethods.js';
import creditTransactionsRouter from './server/routes/creditTransactions.js';

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

// API routes for database operations
app.use('/api/zones', zonesRouter);
app.use('/api/stalls', stallsRouter);
app.use('/api/parking-spots', parkingSpotsRouter);
app.use('/api/users', usersRouter);
app.use('/api/tariffs', tariffsRouter);
app.use('/api/permissions', permissionsRouter);
app.use('/api/subscriptions', subscriptionsRouter);
app.use('/api/transactions', transactionsRouter);
app.use('/api/vehicle-checks', vehicleChecksRouter);
app.use('/api/vehicles', vehiclesRouter);
app.use('/api/payment-methods', paymentMethodsRouter);
app.use('/api/credit-transactions', creditTransactionsRouter);

app.post('/api/gemini', async (req, res) => {
    try {
        const { prompt, responseSchema } = req.body;

        if (!prompt) {
            return res.status(400).json({ message: 'Prompt is required' });
        }

        if (!process.env.API_KEY) {
            return res.status(500).json({ message: 'API key is not configured on the server.' });
        }
        
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        
        const model = 'gemini-2.5-flash';
        
        const config = {};
        if (responseSchema) {
            config.responseMimeType = 'application/json';
            config.responseSchema = responseSchema;
        }

        const response = await ai.models.generateContent({
            model,
            contents: prompt,
            config,
        });

        res.status(200).json({ text: response.text });

    } catch (error) {
        console.error('Error in Gemini API proxy:', error);
        res.status(500).json({ message: 'Error processing your request', error: error.message });
    }
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Backend API server running on http://0.0.0.0:${PORT}`);
});
