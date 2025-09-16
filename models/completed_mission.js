module.exports = (sequelize, DataTypes) => {
  const CompletedMission = sequelize.define('completed_missions', {
    completed_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    mission_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    status: {
      type: DataTypes.ENUM('pending', 'completed', 'failed'),
      defaultValue: 'completed'
    },
    scan_code: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    scan_lat: {
      type: DataTypes.DECIMAL(10,7),
      allowNull: true
    },
    scan_lon: {
      type: DataTypes.DECIMAL(10,7),
      allowNull: true
    },
    timestamp: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    }
  }, {
    tableName: 'completed_missions',
    timestamps: false,
    underscored: true
  });

  return CompletedMission;
};
