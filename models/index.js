const Sequelize = require('sequelize');
const sequelize = require('../config/database');

const UserModel = require('./user');
const MissionModel = require('./missions'); 
const CompletedMissionModel = require('./completed_mission'); 

const DiamondTransactionModel = require('./transaction');
const VoucherModel = require('./voucher');
const RedeemedVoucherModel = require('./redeemed_voucher');

const User = UserModel(sequelize, Sequelize.DataTypes);
const Mission = MissionModel(sequelize, Sequelize.DataTypes);
const CompletedMission = CompletedMissionModel(sequelize, Sequelize.DataTypes);

const DiamondTransaction = DiamondTransactionModel(sequelize, Sequelize.DataTypes);
const Voucher = VoucherModel(sequelize, Sequelize.DataTypes);
const RedeemedVoucher = RedeemedVoucherModel(sequelize, Sequelize.DataTypes);

User.hasMany(CompletedMission, { foreignKey: 'user_id', as: 'completed_missions' });
CompletedMission.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

Mission.hasMany(CompletedMission, { foreignKey: 'mission_id', as: 'completed_by' });
CompletedMission.belongsTo(Mission, { foreignKey: 'mission_id', as: 'mission' });


User.hasMany(DiamondTransaction, { foreignKey: 'user_id', as: 'diamond_transactions' });
DiamondTransaction.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

User.hasMany(RedeemedVoucher, { foreignKey: 'user_id', as: 'redeemed_vouchers' });
RedeemedVoucher.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

Voucher.hasMany(RedeemedVoucher, { foreignKey: 'voucher_id', as: 'redemptions' });
RedeemedVoucher.belongsTo(Voucher, { foreignKey: 'voucher_id', as: 'voucher' });

const db = {
  sequelize,
  Sequelize,
  User,
  Mission,
  CompletedMission,
  DiamondTransaction,
  Voucher,
  RedeemedVoucher
};

module.exports = db;