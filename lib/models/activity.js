'use strict';

module.exports = function (sequelize, DataTypes) {
  return sequelize.define('Activity', {

    // Identifiers
    id: { type: DataTypes.UUID, primaryKey: true, defaultValue: DataTypes.UUIDV4 },
    externalId: { type: DataTypes.STRING, allowNull: false },

    // Temporal
    startTime: { type: DataTypes.DATE },
    movingTime: { type: DataTypes.INTEGER },  // seconds

    // Locational
    startLatitude: { type: DataTypes.DECIMAL },
    startLongitude: { type: DataTypes.DECIMAL },

    // Activity characteristics
    type: { type: DataTypes.STRING },
    title: { type: DataTypes.STRING },
    distance: { type: DataTypes.FLOAT },      // meters
    elevationGain: { type: DataTypes.FLOAT }, // meters
    averageSpeed: { type: DataTypes.FLOAT },  // meters/second
    isCommute: { type: DataTypes.BOOLEAN }

  }, {
    timestamps: true,
    paranoid: false
  });
};
