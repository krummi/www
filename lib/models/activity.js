'use strict';

module.exports = function (sequelize, DataTypes) {
  return sequelize.define('Activity', {
    // Identifiers
    id: { type: DataTypes.UUID, primaryKey: true, defaultValue: DataTypes.UUIDV4 },
    externalId: { type: DataTypes.STRING },

    // Temporal
    timestamp: { type: DataTypes.DATE },
    duration: { type: DataTypes.STRING },

    // Activity characteristics
    type: { type: DataTypes.STRING },
    title: { type: DataTypes.STRING },
    distance: { type: DataTypes.FLOAT },
    elevationGain: { type: DataTypes.FLOAT },
    averageSpeed: { type: DataTypes.FLOAT },
  }, {
    timestamps: true,
    paranoid: true
  });
};
