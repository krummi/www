'use strict';

var RECT_SIZE = 8;
var GUTTER_SIZE = 2;
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
  var percent = commutes.actual / commutes.possible;
  line.animate(percent);
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
