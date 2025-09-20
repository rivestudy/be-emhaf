
module.exports = (sequelize, DataTypes) => {
  const transaction = sequelize.define('diamond_transactions', {
    transaction_id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    amount: {
      type: DataTypes.INTEGER,
      allowNull: false,    
    },
    transaction_type: {
      type: DataTypes.STRING, 
      allowNull: false,
    },
    source_id: {
      type: DataTypes.INTEGER, 
      allowNull: true,
    }
  }, {
    tableName: 'transactions',
    timestamps: true, 
    updatedAt: false,
  });

  return transaction;
};