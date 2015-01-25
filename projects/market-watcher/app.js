var cheerio = require('cheerio');
var request = require('request');
var S = require('string');
var fs = require('fs');
var redis = require('redis');
var util = require('util');
var async = require('async');

var mailer = require('./mailer');

// Create the redis client.
var client = redis.createClient();
client.on('error', function (err) {
  console.log('Error ' + err);
});

var options = {
  url: 'http://www.mbl.is/fasteignir/leit/?q=4f042801943b3a07582f31f942e86280',
  headers: {
    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_8_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/32.0.1700.107 Safari/537.36'
  }
};

console.log('> market watcher running.');

// Retrieve the body of the page. Use a cached one for testing.
var $;
if (fs.existsSync('temp.html')) {
  console.log('> using cached file.');
  $ = cheerio.load(fs.readFileSync('temp.html'), { normalizeWhitespace: true });
  processSite($);
} else {
  console.log('> making a request to mbl.is.');
  request.get(options, function (error, response, body) {
    if (!error && response.statusCode === 200) {
      $ = cheerio.load(body, { normalizeWhitespace: true });

      processSite($);
    } else {
      console.log('> error in fetching mbl.is.');
      process.exit(-1);
    }
  });
}

function getIdFromUrl(url) {
  return url.split('/')[5];
}

function notify(estate) {
  mailer.send({
    email: 'hrafne@gmail.com',
    subject: 'Ný fasteign á mbl.is: ' + estate.title,
    estate: estate
  }, function (success, err) {
    if (!success) {
      console.log('> ERROR: could not send email because of: ' + err);
    } else {
      console.log('> email successfully sent!');
    }
  });
}

function processSite($) {
  // Retrieve an array of estates.
  var tasks = [];
  $('.single-realestate').each(function(i, elem) {
    tasks.push(function (callback) {
      // Extracts data.
      var estate = {};
      estate['url'] = 'http://www.mbl.is' + $(elem).find('> a').attr('href');
      estate['img'] = 'http://www.mbl.is' + $(elem).find('> a img').attr('src');
      estate['id'] = getIdFromUrl(estate['url']);
      estate['title'] = $(elem).find('h4').text() + ' ' + $(elem).find('h5').text();

      $(elem).find('.realestate-properties > span').each(function(i, elem) {
        var pair = S($(elem).text()).trim().s.split(':');
        var key = S(pair[0]).trim().s;
        var value = S(pair[1]).trim().s;
        estate[key] = value;
      });

      // Query redis regarding elem ID.
      var key = 'estate:' + estate['id'];
      client.hgetall(key, function (err, obj) {
        // If it was not found, save it.
        if (obj === null) {
          // Notify that there is a new estate.
          notify(estate);

          // And save it to redis.
          client.hmset(key, estate, function (err, res) {
            if (err) {
              callback('could not save to redis.', null);
            } else {
              console.log('> saved: ' + JSON.stringify(estate));
              callback(null, { new: 1, updated: 0 });
            }
          });
        } else {
          // TODO: Check if the price has lowered.
          callback(null, { new: 0, updated: 0 });
        }
      });
    });
  });
  async.parallel(tasks, function (err, results) {
    if (err) {
      console.log('> ERROR: ' + err);
      process.exit(-1);
    } else {
      var updated = 0, _new = 0, total = 0;
      for (var i = 0; i < results.length; i++) {
        updated += results[i]['updated'];
        _new    += results[i]['new'];
        total   += 1;
      }
      console.log(util.format('> total of %d estates (new: %d, updated: %d).', total, _new, updated));
    }

    // Save n' quit.
    client.save(function (err, res) {
      console.log('> persisting to disk: success.');
      client.quit(function (err, res) {
        console.log('> all done, exiting.');
      });
    });
  });
}