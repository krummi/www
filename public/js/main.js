

var RECT_SIZE = 9;
var GUTTER_SIZE = 1;
var SVG_NAMESPACE = "http://www.w3.org/2000/svg";

if (commutes) {
  // Heatmap.
  var rects = '<rect width="10" height="10" x="0" y="0" class="yes"></rect>';
  var week = 0;
  var day = 0;
  var x = 0;
  for (var i = 0; i < (commutes.left + commutes.possible); i++) {
    var y = day * (GUTTER_SIZE + RECT_SIZE);
    var rect;
    if (i >= commutes.arr.length) {
      rect = getRectString(x, y, 'na');
    } else {
      if (commutes.arr[i] === 1) {
        rect = getRectString(x, y, 'yes');
      } else {
        rect = getRectString(x, y, 'no');
      }
    }
    document.getElementById('commutes').appendChild(rect);

    day++;
    if (day === 5) { // It's Friday!
      week++;
      day = 0;
      x += RECT_SIZE + GUTTER_SIZE;
    }
  }
  $('#commutes').append(rects);

  // Progress bar.
  var line = new ProgressBar.Line('#commutes-progress-bar', {
    color: '#669d45',
    trailColor: '#EDEDED'
  });
  var ratio = commutes.actual / commutes.possible;
  line.animate(ratio);
  var percentage = ratio * 100;

  var left = commutes.actual + '/' + commutes.possible + ' DAGAR (' + percentage + '%)';
  var right= commutes.left + ' EFTIR';
  $('#commutes-progress-bar-info > .left').text(left);
  $('#commutes-progress-bar-info > .right').text(right);


  // Hours
  $('#weekly-graph-container').highcharts({
    chart: {
      type: 'bar',
      height: 150,
      backgroundColor: 'rgb(244, 244, 244)'
    },
    title: {
      text: ''
    },
    xAxis: {
      categories: weeks.titles
    },
    yAxis: {
      min: 0,
      title: {
        text: 'Klukkustundir'
      }
    },
    plotOptions: {
      series: {
        stacking: 'normal'
      },
      bar: {
        borderWidth: 0
      }
    },
    credits: {
      enabled: false
    },
    exporting: {
      enabled: false
    },
    tooltip: {
      formatter: function() {
        return '<b>' + this.x + '</b> (' + this.series.name + '): ' + pretty(this.y);
      }
    },
    series: [{
      name: 'Hlaup',
      data: weeks.runs,
      color: '#669d45'
    }, {
      name: 'Sund',
      data: weeks.swims,
      color: 'rgb(85, 98, 109)'
    }, {
      name: 'Hjól',
      data: weeks.rides,
      color: 'lightgray'
    }]
  });


  // Current week stuff
  var startColor = '#FC5B3F';
  var endColor = '#669d45';

  var keys = Object.keys(curWeek.summary);
  for (var i = 0; i < keys.length; i++) {
    var key = keys[i];
    var isMapping = { Ride: 'Hjól', Run: 'Hlaup', Swim: 'Sund' };
    var decimal = curWeek.summary[key] / 3600;
    var row = '<tr>' +
      '<td class="sport">' + isMapping[key] + '</td>' +
      '<td class="actual">' + pretty(decimal) + '</td>' +
      '<td id="' + key + '-container" class="progress-containers"></td>' +
      '<td class="planned">3klst 30m</td>'+
      '</tr>';
    $('#current-week-table').append(row);

    // The progress bar for this item!
    var element = document.getElementById(key + '-container');
    var circle = new ProgressBar.Circle(element, {
      color: '#669d45',
      trailColor: '#eee',
      trailWidth: 1,
      duration: 2000,
      easing: 'bounce',
      strokeWidth: 5,
      text: {
        value: '0'
      },

      // Set default step function for all animate calls
      step: function(state, c) {
        c.setText((circle.value() * 100).toFixed(0) + '%');
        c.path.setAttribute('stroke', state.color);
      }
    });

    circle.animate(1, {
      from: {color: startColor},
      to: {color: endColor}
    });
  }
}

function pretty(decimal) {
  return Math.floor(decimal) + 'klst ' + Math.round(((decimal % 1) * 60)) + 'm';
}

function getRectString(x, y, type) {
  var rect = document.createElementNS(SVG_NAMESPACE, 'rect');
  rect.setAttributeNS(null, 'x', x);
  rect.setAttributeNS(null, 'y', y);
  rect.setAttributeNS(null, 'height', RECT_SIZE.toString());
  rect.setAttributeNS(null, 'width', RECT_SIZE.toString());
  rect.setAttributeNS(null, 'class', type);
  return rect;
}
