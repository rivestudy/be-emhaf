module.exports = (sequelize, DataTypes) => {
  const voucher = sequelize.define('vouchers', {
    voucher_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
    },
    cost: {
      type: DataTypes.INTEGER,
      allowNull: false, 
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    voucher_img: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  }, {
    tableName: 'vouchers',
    timestamps: true,
  });

  return voucher;
};