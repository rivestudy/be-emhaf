const express = require('express');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const cors = require('cors');
const db = require('../models');
const authRoutes = require('../routes/auth');
const missionRoutes = require('../routes/missions');
const voucherRoutes = require('../routes/voucher');
const userRoutes = require('../routes/user');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());

app.use('/api/auth', authRoutes);
app.use('/api/vouchers', voucherRoutes);
app.use('/api/missions', missionRoutes);
app.use('/api/users', userRoutes);

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
