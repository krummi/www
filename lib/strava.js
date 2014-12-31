'use strict';

var request = require('request');
var async = require('async');
var moment = require('moment');
var _ = require('lodash');

// Constants

var PER_PAGE = 50;

// Utils

function toUnixTime(d) {
  return Math.round(d.getTime() / 1000);
}

// Data types

function Strava(options) {
  this.accessToken = options.accessToken;
  this.updatedAt = undefined;
  if (options.updatedAt) {
    this.updatedAt = options.updatedAt;
  }
  this.itemsFetched = 0;
  this.items = [];
}

Strava.prototype.isFinished = function () {
  return this.itemsFetched > 0;
};

Strava.prototype.fetch = function (callback) {
  var self = this;
  async.doWhilst(
    this.get.bind(this),
    this.isFinished.bind(this),
    function (err) {
      if (err) {
        return callback(err, null);
      }

      console.log('I AM HERE :D');

      // No new entries were found.
      if (this.items.length === 0) {
        return callback(null, []);
      }

      // Return the entries that were found!
      return callback(null, this.items);
    }.bind(this)
  );
};

Strava.prototype.get = function (callback) {

  var self = this;

  // If the user has never pulled data from Strava before.
  var params = {
    url: 'https://www.strava.com/api/v3/athlete/activities',
    headers: {
      Authorization: 'Bearer ' + this.accessToken
    },
    qs: {
      per_page: PER_PAGE,
      after: this.updatedAt ? toUnixTime(this.updatedAt) : 0
    }
  };

  request.get(params, function (err, res, body) {
    // Deal with errors.
    if (err) {
      return callback(err);
    } else if (res.statusCode !== 200) {
      var error = new Error(body);
      error.code = 'NON-200-RESPONSE';
      return callback(error);
    }

    // Try to parse the response.
    var parsed = null;
    try {
      parsed = JSON.parse(body);
    } catch (ex) {
      var error = new Error('could not parse body: ' + body);
      error.code = 'UNABLE-TO-PARSE';
      return callback(error);
    }

    // If the parsed length is zero, stop.
    if (parsed.length === 0) {
      self.itemsFetched = 0;
      return callback();
    }

    // We received some data.
    for (var i = 0; i < parsed.length; i++) {
      var item = parsed[i];
      var exercise = self.processItem(item);
      self.items.push(exercise);
    }

    // Update the variables accordingly.
    self.itemsFetched = parsed.length;
    console.log(_.last(parsed).start_date);
    console.log('updated "itemsFetched" to: ', self.itemsFetched);
    var lastTimestamp = _.last(self.items).startTime;
    self.updatedAt = lastTimestamp;
    console.log('updated "updatedAt" to: ', self.updatedAt);
    return callback();
  });
};

Strava.prototype.processItem = function (item) {
  return {
    externalId: item.id,

    startTime: moment(item.start_date).toDate(),
    movingTime: item.moving_time,

    startLatitude: item.start_latitude,
    startLongitude: item.start_longitude,

    type: item.type,
    title: item.name,
    distance: item.distance,
    elevationGain: item.total_elevation_gain,
    averageSpeed: item.average_speed,
    isCommute: item.commute
  };
};

module.exports = Strava;
