// /routes/missions.js
import express from 'express';
import { authenticateToken } from '../middlewares/authMiddleware.js';
import { postScan, getAllMissions, getNextMission, getMissionsByFilter } from '../controllers/missionController.js';

const router = express.Router();

router.post('/scan', authenticateToken, postScan);
router.get("/all/:user_id", authenticateToken, getAllMissions);
router.get("/next/:user_id", authenticateToken, getNextMission);
router.get("/filter", authenticateToken, getMissionsByFilter);
export default router;
