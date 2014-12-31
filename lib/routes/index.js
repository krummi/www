var express = require('express');
var moment = require('moment');
var log = require('../helpers/logger');
var router = express.Router();
var models = require('../models');

var Activity = models.Activity;

router.get('/', function (req, res) {
  Activity.findAll({
    where: {
      startTime: {
        between: [
          moment('2014-01-01').toString(),
          moment('2015-01-01').toString()
        ]
      }
    }
  })
  .then(function (activities) {
    log.info('no of activities: %d', activities.length);
    res.render('index', { activities: JSON.stringify(activities) });
  })
  .catch(function (err) {
    log.error({ err: err }, 'error hit when fetching from postgres.');
  });
});

module.exports = router;
