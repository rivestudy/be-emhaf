const express = require('express');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const db = require('../models');
const authRoutes = require('../routes/auth');
const missionRoutes = require('../routes/missions');
const voucherRoutes = require('../routes/voucher');
const userRoutes = require('../routes/user');
const cdnRoutes = require('../routes/cdn');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const uploadPath = path.resolve(__dirname, '../uploads');

app.use(cors());
app.use(bodyParser.json());

app.use('/api/auth', authRoutes);
app.use('/api/vouchers', voucherRoutes);
app.use('/api/missions', missionRoutes);
app.use('/api/users', userRoutes);
app.use('/api/cdn', cdnRoutes);
app.use('/cdn', express.static(uploadPath));
app.get('/', (req, res) => res.json({ ok: true, message: 'Missions API up' }));

(async () => {
  try {
    await db.sequelize.authenticate();
    console.log('Database connected via Sequelize.');
    await db.sequelize.sync();

    app.listen(PORT, () => {
      console.log(`Server running on :${PORT}`);
      console.log(`CDN available at :${PORT}/cdn/<filename>`);
    });
  } catch (err) {
    console.error('Unable to connect to DB:', err);
    process.exit(1);
  }
})();
