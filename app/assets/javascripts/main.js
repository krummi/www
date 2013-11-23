function spin() {
  $('#loading-spinner').show();
  $('#exercise').hide();
  // Configure spin.js.
  var opts = {
    lines: 7, // The number of lines to draw
    length: 5, // The length of each line
    width: 5, // The line thickness
    radius: 7, // The radius of the inner circle
    corners: 1, // Corner roundness (0..1)
    rotate: 0, // The rotation offset
    direction: 1, // 1: clockwise, -1: counterclockwise
    color: 'green', // #rgb or #rrggbb or array of colors
    speed: 1, // Rounds per second
    trail: 66, // Afterglow percentage
    shadow: false, // Whether to render a shadow
    hwaccel: false, // Whether to use hardware acceleration
    className: 'spinner', // The CSS class to assign to the spinner
    zIndex: 2e9, // The z-index (defaults to 2000000000)
    top: 'auto', // Top position relative to parent in px
    left: 'auto' // Left position relative to parent in px
  };

  var target = document.getElementById('loading-spinner');
  $('#loading-spinner').empty();
  var spinner = new Spinner(opts).spin(target);
}

function fetchData(callback, noOfMonths) {
  spin();
  // Make the AJAX request.
  jQuery.ajax({
    "async": true,
    "url": "http://sportscal.herokuapp.com/callback.json?user=krummi&callback=flipp",
    "dataType": 'jsonp',
    "method": "GET",
    "error": function (jqXHR, textStatus, errorThrown) {
      document.results = {};
    },
    "success": function (data, textStatus, jqXHR) {
      document.results = {};
      for (var i = 0; i < data.length; i++) {
        var day = new Date(data[i]['performed_at']);
        var stuff = day.getTime() / 1000;
        if (stuff in document.results) {
          document.results[stuff] += 1;
        } else {
          document.results[stuff] = 1;
        }
      }
      callback(noOfMonths);
    }
  });
}

function heatmap(months) {
  $('#loading-spinner').hide();
  $('#exercise').show();
  var cal = new CalHeatMap();
  cal.init({
    itemSelector: "#exercise",
    domain: "month",
    subDomain: "x_day",
    data: document.results,
    start: new Date(2013, 6, 1),
    cellSize: 10,
    cellPadding: 2,
    domainGutter: 20,
    range: months,
    domainDynamicDimension: false,
    domainLabelFormat: function(date) {
      moment.lang("en");
      return moment(date).format("MMMM").toUpperCase();
    },
    legend: [1, 3, 5, 7],
    displayLegend: false
  });
}

$(function() {
  enquire.register("screen and (max-width: 767px)", {
    match: function() {
      $('#exercise').empty();
      fetchData(heatmap, 3);
    }
  });
  enquire.register("screen and (min-width: 768px) and (max-width: 992px)", {
    match: function() {
      $('#exercise').empty();
      fetchData(heatmap, 7);
    }
  });
  enquire.register("screen and (min-width: 993px)", {
    match: function() {
      $('#exercise').empty();
      fetchData(heatmap, 5);
    }
  });


});