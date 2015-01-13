var fs = require('fs');
var path = require('path');
var Sequelize = require('sequelize');
var lodash = require('lodash');
var log = require('../helpers/logger');
var env = process.env.NODE_ENV || 'development';

var configuration = {
  dialect: 'postgres'
};
if (env !== 'production') {
  configuration.logging = log.info.bind(log);
}
var sequelize = new Sequelize(process.env.DATABASE_URL, configuration);
var db = {};

fs.readdirSync(__dirname)
  .filter(function(file) {
    return (file.indexOf('.') !== 0) && (file !== 'index.js')
  })
  .forEach(function(file) {
    var model = sequelize.import(path.join(__dirname, file))
    db[model.name] = model
  })

Object.keys(db).forEach(function(modelName) {
  if ('associate' in db[modelName]) {
    db[modelName].associate(db)
  }
})

module.exports = lodash.extend({
  sequelize: sequelize,
  Sequelize: Sequelize
}, db)
