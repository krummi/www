function generateCalendar(exclude_weekend, data) {
    // Probably the most awful code ever.
    html = ['<table cellpadding="3" cellspacing="0" border="0"><thead><tr><th>Mán.</th><th>Þri.</th><th>Mið.</th><th>Fim.</th><th>Fös.</th><th>Lau.</th><th>Sun.</th></tr></thead><tbody>'];
    html.push("<tr>");
    var dayOfWeek = 1, line;
    for (var i = 1; i <= 31; i++) {
        if (exclude_weekend && (dayOfWeek === 6 || dayOfWeek === 7)) {
            line = '  <td><img src="img/empty.png" /></td>';
        } else if (data[i-1] !== undefined) {
            var type    = (typeof data[i-1] === 'number' ? data[i-1] : data[i-1][0]);
            var comment = (typeof data[i-1] === 'number' ? null : data[i-1][1]);
            if (type === 1) {
                line = '  <td><img src="img/free.png" ';
            } else {
                line = '  <td><img src="img/partially_free.png" ';
            } 
            if (comment !== null) line = line.concat('title="' + comment + '"');
            line = line.concat(' /></td>');
        } else { 
            line = '  <td><img src="img/empty_circle.gif" style="width: 12px; height: auto;" /></td>';
        }
        html.push(line);

        if (dayOfWeek === 7) {
            html.push('</tr><tr>');
            dayOfWeek = 0;
        }
        dayOfWeek++;
    }
    for (var i = 0; i < 4; i++) { 
        html.push('  <td>&nbsp;</td>');
    }
    html.push('</tr>');
    html.push('</tbody></table>');
    return $(html.join(''));
}

function createChart(id, y_min, y_max, y_title, color, data, formatter_func) {
    chart = new Highcharts.Chart({
        chart: {
            renderTo: id,
            type: 'spline'
        },
        title: {
            text: ''
        },
        xAxis: {
            type: 'datetime',
            min: Date.UTC(2012, 9,  1),
            max: Date.UTC(2012, 10, 1),
            dateTimeLabelFormats: { // don't display the dummy year
                week: '%e. okt'
            }
        },

        yAxis: {
            title: {
                text: y_title
            },
            min: y_min,
            max: y_max,
            plotLines: [{
                value: 0,
                width: 1,
                color: color
            }]
        },
        credits: {
            enabled: false
        },
        tooltip: {
            formatter: formatter_func
        },
        legend: {
            enabled: false
        },
        series: [{
            name: 'Þyngd',
            color: color,
            data: data
        }]
    });
}
