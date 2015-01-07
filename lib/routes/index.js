var express = require('express');
var moment = require('moment');
var log = require('../helpers/logger');
var router = express.Router();
var models = require('../models');
var _ = require('lodash');

var Activity = models.Activity;

var FIRST_MONDAY = 5;
var TOTAL_COMMUTE_DAYS = 5 * 52;

router.get('/', function (req, res) {
  Activity.findAll({
    where: {
      startTime: {
        between: [
          moment('2015-01-01').toString(),
          moment('2016-01-01').toString()
        ]
      }
    }
  })
  .then(function (activities) {
    // Common stuff.
    var now = moment();

    // Find all activities for the current week.
    var curWeek = now.isoWeek();
    var curWeekActivities = _.where(activities, function (activity) {
      return moment(activity.startTime).isoWeek() === curWeek;
    });

    var hours = {};
    _.forEach(curWeekActivities, function (activity) {
      if (!hours[activity.values.type]) {
        hours[activity.values.type] = activity.values.movingTime;
      } else {
        hours[activity.values.type] += activity.values.movingTime;
      }
    });

    log.info(hours);
    log.info('curWeekActivities.length:', curWeekActivities.length);
    log.info('no of activities: %d', activities.length);

    // Creates the commute data
    var commuteActivities = _.where(activities, { isCommute: true });
    var commuteArray = _.range(0, TOTAL_COMMUTE_DAYS, 0);
    _.forEach(commuteActivities, function (activity) {
      var index = mapDayOfYearToArrayIndex(moment(activity.startTime).dayOfYear());
      if (index >= 0 && index < commuteArray.length) {
        commuteArray[index] = 1;
      } else {
        log.error({ activitiy: activity.values }, 'fucked up activity.');
      }
    });
    var noOfCommutes = commuteActivities.length;
    var possibleCommutes = mapDayOfYearToArrayIndex(now.dayOfYear()) + 1;

    log.info({
      arr: commuteArray,
      actual: noOfCommutes,
      possible: possibleCommutes,
      left: (TOTAL_COMMUTE_DAYS - possibleCommutes)
    }, 'commutes');

    res.render('index', { activities: JSON.stringify(activities) });
  })
  .catch(function (err) {
    log.error({ err: err }, 'error hit when fetching from postgres.');
  });
});



function mapDayOfYearToArrayIndex(dayOfYear) {
  // My first week is on the 6th of January.
  dayOfYear -= FIRST_MONDAY;
  var week = Math.floor(dayOfYear / 7);
  var day = dayOfYear - (week * 7);
  return week * 5 + day;
}

module.exports = router;
