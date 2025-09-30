module.exports = (sequelize, DataTypes) => {
  const redeemed_vouchers = sequelize.define('redeemed_vouchers', {
    redemption_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    voucher_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    voucher_status: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
    },
  }, {
    tableName: 'redeemed_vouchers',
    timestamps: true,
    updatedAt: false,
  });

  return redeemed_vouchers;
};