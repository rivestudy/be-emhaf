import db from "../models/index.js";
import { Op } from "sequelize";

const { Mission, CompletedMission } = db;

function haversineDistance(lat1, lon1, lat2, lon2) {
  const toRad = (deg) => (deg * Math.PI) / 180;
  const R = 6371000; 

  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export const postScan = async (req, res) => {
  try {
    const { scan_code, scan_lat, scan_lon, user_id } = req.body;
    const authUserId = req.user.id;

    if (parseInt(user_id) !== parseInt(authUserId)) {
      return res.status(403).json({ message: "Forbidden: token user mismatch" });
    }

    if (!scan_code) return res.status(400).json({ message: "scan_code required" });
    if (!scan_lat || !scan_lon) {
      return res.status(400).json({ message: "scan_lat and scan_lon required" });
    }

    // 🔎 Find mission by scan_code
    const mission = await Mission.findOne({
      where: { mission_code: scan_code },
    });

    if (!mission) {
      return res.status(404).json({ message: "Mission not found for provided scan_code" });
    }

    // ✅ Check if already completed
    const alreadyCompleted = await CompletedMission.findOne({
      where: {
        user_id: user_id,
        mission_id: mission.mission_id,
        status: "completed",
      },
    });

    if (alreadyCompleted) {
      return res.status(400).json({
        message: "Mission already completed by this user",
      });
    }

    // 📏 Distance validation
    const distance = haversineDistance(
      parseFloat(scan_lat),
      parseFloat(scan_lon),
      parseFloat(mission.mission_lat),
      parseFloat(mission.mission_lon)
    );

    if (distance > 50) {
      return res.status(400).json({
        message: `Too far from mission location (distance: ${Math.round(distance)}m)`,
      });
    }

    // ✅ Save completed mission
    const completed = await CompletedMission.create({
      user_id,
      mission_id: mission.mission_id,
      status: "completed",
      scan_code: String(scan_code),
      scan_lat,
      scan_lon,
    });

    return res.status(201).json({ message: "Scan recorded", completed });
  } catch (err) {
    console.error("postScan error", err);
    return res.status(500).json({ message: "Server error", error: err.message });
  }
};


export const getAllMissions = async (req, res) => {
  try {
    const { user_id } = req.params;

    const missions = await Mission.findAll();

    const results = await Promise.all(
      missions.map(async (m) => {
        const completed = await CompletedMission.findOne({
          where: { user_id, mission_id: m.mission_id },
        });
        return {
          mission_id: m.mission_id,
          mission_name: m.mission_name,
          mission_desc: m.mission_description,
          mission_image: m.mission_image,
          mission_status: completed ? completed.status : "not started",
          mission_difficulty: m.mission_difficulty,
          mission_category: m.mission_category,
        };
      })
    );

    res.json(results);
  } catch (err) {
    res.status(500).json({ message: "Error fetching missions", error: err.message });
  }
};

export const getNextMission = async (req, res) => {
  try {
    const { user_id } = req.params;

    const completedMissions = await CompletedMission.findAll({
      where: { user_id },
      attributes: ["mission_id"],
    });

    const completedIds = completedMissions.map((cm) => cm.mission_id);

    const nextMission = await Mission.findOne({
      where: completedIds.length > 0 ? { mission_id: { [Op.notIn]: completedIds } } : {},
    });

    if (!nextMission) {
      return res.json({ message: "No more missions available" });
    }

    res.json({
      mission_id: nextMission.mission_id,
      mission_name: nextMission.mission_name,
      mission_desc: nextMission.mission_description,
      mission_image: nextMission.mission_image,
      mission_lat: nextMission.mission_lat,
      mission_lon: nextMission.mission_lon,
      mission_difficulty: nextMission.mission_difficulty
    });
  } catch (err) {
    res.status(500).json({ message: "Error fetching next mission", error: err.message });
  }
};

// 📌 Get missions by category & difficulty (with user status)
export const getMissionsByFilter = async (req, res) => {
  try {
    const { category, difficulty, user_id } = req.query; // ✅ include user_id in query

    if (!user_id) {
      return res.status(400).json({ message: "user_id is required" });
    }

    const whereClause = {};
    if (category) whereClause.mission_category = category;
    if (difficulty) whereClause.mission_difficulty = difficulty;

    const missions = await Mission.findAll({ where: whereClause });

    const results = await Promise.all(
      missions.map(async (m) => {
        const completed = await CompletedMission.findOne({
          where: { user_id, mission_id: m.mission_id },
        });

        return {
          mission_id: m.mission_id,
          mission_name: m.mission_name,
          mission_desc: m.mission_description,
          mission_image: m.mission_image,
          mission_status: completed ? completed.status : "not started", // ✅ added status check
          mission_difficulty: m.mission_difficulty,
          mission_category: m.mission_category,
        };
      })
    );

    res.json(results);
  } catch (err) {
    res.status(500).json({ message: "Error filtering missions", error: err.message });
  }
};
