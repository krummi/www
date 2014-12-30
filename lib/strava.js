'use strict';

var request = require('request');
var async = require('async');
var moment = require('moment');
var _ = require('lodash');

// Constants

var PER_PAGE = 50;

// Utils

function toUnixTime(str) {
  return (moment(str).toDate().getTime() / 1000);
}

// Data types

function Strava(options) {
  this.accessToken = options.accessToken;
  this.updatedAt = undefined;
  if (options.updatedAt) {
    this.updatedAt = toUnixTime(options.updatedAt);
  }
  this.itemsFetched = 0;
  this.items = [];
}

Strava.prototype.isFinished = function () {
  return this.itemsFetched > 0;
};

Strava.prototype.store = function (items, callback) {

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

      // No new entries were found.
      if (this.items.length === 0) {
        return callback(null, 0);
      }

      // Save the items in the database.
      // TODO: This!
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
      after: this.updatedAt ? this.updatedAt : 0
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

    console.log('strava');
    console.log(_.last(parsed));
    console.log('yourself.io');
    console.log(_.last(self.items));

    // Update the variables accordingly.
    self.itemsFetched = parsed.length;
    console.log('updated "itemsFetched" to: ', self.itemsFetched);
    var lastTimestamp = _.last(self.items).performed_at;
    console.log('last item "performed_at": ', lastTimestamp);
    self.updatedAt = toUnixTime(lastTimestamp);
    console.log('updated "updatedAt" to: ', self.updatedAt);
    return callback();
  });
};

Strava.prototype.processItem = function (item) {
  var exercise = {
    external_id: item.id,
    type: item.type,
    performed_at: moment(item.start_date).format(),
    details: {
      title: item.name,
      url: 'http://www.strava.com/activities/' + item.id,
      total_elevation_gain: item.total_elevation_gain,
      average_speed: item.average_speed,
      distance: item.distance,
      duration: item.elapsed_time,
      location_latlng: [
        item.start_latitude,
        item.start_longitude
      ]
    }
  };
  return exercise;
};

module.exports = Strava;

var test = new Strava({
  accessToken: 'f2877b070e0172315d80bdcd21f7acd028f08851'
//,  updatedAt: '2014-12-27T17:32:02+00:00'
});

test.fetch(function () {
  console.log('hhahah');
});
