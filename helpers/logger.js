var bunyan = require('bunyan');

var logger = bunyan.createLogger({
  name: 'eiriksson.is'
});

module.exports = logger;