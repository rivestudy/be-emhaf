import Sequelize from 'sequelize';
import sequelize from '../config/database.js';

import UserModel from './user.js';
import MissionModel from './missions.js';
import CompletedMissionModel from './completed_mission.js';

const User = UserModel(sequelize, Sequelize.DataTypes);
const Mission = MissionModel(sequelize, Sequelize.DataTypes);
const CompletedMission = CompletedMissionModel(sequelize, Sequelize.DataTypes);

User.hasMany(CompletedMission, { foreignKey: 'user_id', as: 'completed_missions' });
CompletedMission.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

Mission.hasMany(CompletedMission, { foreignKey: 'mission_id', as: 'completed_by' });
CompletedMission.belongsTo(Mission, { foreignKey: 'mission_id', as: 'mission' });

const db = {
  sequelize,
  Sequelize,
  User,
  Mission,
  CompletedMission
};

export default db;
