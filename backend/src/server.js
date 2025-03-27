import express from 'express';
import cors from 'cors';
import connectDB from './config/database.js';
import apiRoutes from './routes/api.js';
import { seedAnswers } from './utils/seedData.js';

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Connect to Database
connectDB();

// Routes
app.use('/api', apiRoutes);

// Seed initial data
seedAnswers();

app.get('/', (req, res) => {
  res.send('Backend is running!');
});


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export default app;