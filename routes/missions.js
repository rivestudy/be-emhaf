const express = require('express');
const { authenticateToken } = require('../middlewares/authMiddleware');
const {
  postScan,
  getAllMissions,
  getNextMission,
  getMissionsByFilter,
} = require('../controllers/missionController');

const router = express.Router();

router.post('/scan', authenticateToken, postScan);
router.get('/all/:user_id', authenticateToken, getAllMissions);
router.get('/next/:user_id', authenticateToken, getNextMission);
router.get('/filter', authenticateToken, getMissionsByFilter);

module.exports = router;
