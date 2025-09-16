// server.js
import express from 'express';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import cors from 'cors';
import db from './models/index.js';
import authRoutes from './routes/auth.js';
import missionRoutes from './routes/missions.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());

app.use('/api/auth', authRoutes);
app.use('/api/missions', missionRoutes);
app.get('/', (req, res) => res.json({ ok: true, message: 'Missions API up' }));

(async () => {
  try {
    await db.sequelize.authenticate();
    console.log('Database connected via Sequelize.');
    await db.sequelize.sync();
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (err) {
    console.error('Unable to connect to DB:', err);
    process.exit(1);
  }
})();
