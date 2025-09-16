module.exports = (sequelize, DataTypes) => {
  const Mission = sequelize.define("missions", {
    mission_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    mission_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    mission_description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    mission_image: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    mission_lat: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    mission_lon: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    mission_difficulty: {
      type: DataTypes.ENUM("easy", "medium", "hard"),
      allowNull: false,
      defaultValue: "easy",
    },
    mission_category: {
      type: DataTypes.ENUM("adventure", "puzzle", "quiz"),
      allowNull: false,
      defaultValue: "adventure",
    },
    mission_code: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
  }, {
    tableName: "missions",
    timestamps: false,
  });

  return Mission;
};
