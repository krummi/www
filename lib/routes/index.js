'use strict';

var express = require('express');
var moment = require('moment');
var log = require('../helpers/logger');
var router = express.Router();
var models = require('../models');
var _ = require('lodash');

var Activity = models.Activity;

var FIRST_MONDAY = 5;
var TOTAL_COMMUTE_DAYS = 5 * 52;

var PLAN = {
  '3': {
    Swim: '3.0',
    Run: '3.0',
    Ride: '4.0'
  }
}

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

    // Calculates summaries for all weeks.
    var curWeek = now.isoWeek();
    var weeklyActivities = _.groupBy(activities, function (activity) {
      return moment(activity.startTime).isoWeek();
    });
    var weeks = _.mapValues(weeklyActivities, function (activities, week) {
      var hours = { Swim: 0, Run: 0, Ride: 0 };
      _.forEach(activities, function (activity) {
        if (!hours[activity.values.type]) {
          hours[activity.values.type] = activity.values.movingTime;
        } else {
          hours[activity.values.type] += activity.values.movingTime;
        }
      });
      return {
        summary: hours,
        activities: activities
      };
    });

    var titles = _.map(_.keys(weeks), function (week) {
      return 'Vika #' + (parseInt(week, 10) - 1);
    });
    var rides = pluckAndConvert(weeks, 'Ride');
    var swims = pluckAndConvert(weeks, 'Swim');
    var runs = pluckAndConvert(weeks, 'Run');

    // Creates the commute data
    var commuteActivities = _.where(activities, { isCommute: true });
    var mapping = mapDayOfYearToDayAndWeek(now.dayOfYear());
    // [1st week, monday] => [0, 1] => 1
    // [1st week, friday] => [0, 5] => 5
    // [1st week, sunday] => [0, 5] => 5
    // [2nd week, monday] => [1, 1] => 6
    // [2nd week, friday] => [1, 5] => 10
    // [2nd week, sunday] => [1, 5] => 10
    var possibleCommutes = mapping[0] * 5 + Math.min((mapping[1] + 1), 5);

    var commuteArray = _.range(0, possibleCommutes, 0);
    _.forEach(commuteActivities, function (activity) {
      var m = mapDayOfYearToDayAndWeek(moment(activity.startTime).dayOfYear());
      var index = m[0] * 5 + m[1];
      if (index >= 0 && index < commuteArray.length) {
        commuteArray[index] = 1;
      } else {
        log.error({ activitiy: activity.values }, 'fucked up activity.');
      }
    });
    var noOfCommutes = commuteActivities.length;
    var thisWeek = {
      planned: PLAN[curWeek] || { Swim: 0, Run: 0, Ride: 0 },
      actual: (weeks[curWeek] && weeks[curWeek].summary) || { Swim: 0, Run: 0, Ride: 0 }
    }
    res.render('index', {
      commutes: JSON.stringify({
        arr: commuteArray,
        actual: noOfCommutes,
        possible: possibleCommutes,
        left: (TOTAL_COMMUTE_DAYS - possibleCommutes)
      }),
      weeks: JSON.stringify({
        titles: titles,
        swims: swims,
        runs: runs,
        rides: rides
      }),
      curWeek: JSON.stringify(thisWeek)
    });
  })
  .catch(function (err) {
    log.error({ err: err }, 'error hit when fetching from postgres.');
  });
});

function pluckAndConvert(weeks, sport) {
  return _.map(_.pluck(_.pluck(weeks, 'summary'), sport), function (seconds) {
    return seconds / 3600;
  });
}

function mapDayOfYearToDayAndWeek(dayOfYear) {
  // My first week is on the 6th of January.
  dayOfYear -= FIRST_MONDAY;
  var week = Math.floor(dayOfYear / 7);
  var day = dayOfYear - (week * 7);
  return [ week, day ];
}

module.exports = router;
