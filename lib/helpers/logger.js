var bunyan = require('bunyan');

var logger = bunyan.createLogger({
  name: 'eiriksson.is',
  stream: process.stdout,
  level: 'debug',
  serializers: bunyan.stdSerializers
});

module.exports = logger;
