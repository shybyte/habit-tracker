function getLastMonthData() {
  var lastMonthActions = Actions.find({
    date: {$gte: moment().subtract('days', 31).toDate()}
  }, {sort: {date: 1}}).fetch().map(function (action) {
    return $.extend({}, action, {
      habit: Habits.findOne({_id: action.habit})
    });
  });

  var now = moment();
  var firstActionInLastMonth = lastMonthActions[0];
  if (!firstActionInLastMonth) {
    return [];
  }
  var daysSinceFirstActionInLastMonth = moment.duration((Date.now() - firstActionInLastMonth.date.getTime())).days();
  var daysRange = Number.range(Math.min(31, daysSinceFirstActionInLastMonth + 2), 0).every();
  var actionsByCategory = lastMonthActions.groupBy(function (action) {
    return action.habit.category;
  });
  return Object.keys(actionsByCategory).map(function (categoryId) {
    return {
      values: daysRange.map(function (daysAgo) {
        var dayX = moment(now).subtract('days', daysAgo);
        var actionsOnDayX = actionsByCategory[categoryId].filter(function (action) {
          return moment(action.date).dayOfYear() == dayX.dayOfYear();
        });
        return {x: dayX.toDate(), y: actionsOnDayX.sum('duration'), actions: actionsOnDayX}
      }),
      value: actionsByCategory[categoryId].sum('duration'),
      key: Categories.findOne({_id: categoryId}).title
    };
  });
}


Template.stats.rendered = function () {
  var self = this;
  if (!self.drawStats) {
    self.drawStats = Meteor.autorun(function () {
      var data = getLastMonthData();

      nv.addGraph(function () {
        var chart = nv.models.multiBarChart().stacked(true)
          .transitionDuration(350)
          .reduceXTicks(true)   //If 'false', every single x-axis tick label will be rendered.
          .rotateLabels(0)      //Angle to rotate x-axis labels.
          .showControls(data.length > 1)   //Allow user to switch between 'Grouped' and 'Stacked' mode.
          .groupSpacing(0.1)    //Distance between each group of bars.
          .showYAxis(true);


        chart.xAxis
          .tickFormat(function (d) {
            return d3.time.format('%a %e %b')(d)
          });

        chart.yAxis
          .axisLabel('Minutes')
          .tickFormat(d3.format(',.0f'));

        chart.yAxis.axisLabelDistance(50);

        chart.tooltipContent(function (key, dateString, minutesSum, graph) {
          console.log(graph.point.actions);
          var $tooltip = $('<div/>');
          UI.insert(UI.renderWithData(Template.tooltipBarChart, {
            title: key,
            date: dateString,
            minutesSum: minutesSum,
            actions: graph.point.actions
          }), $tooltip.get(0));
          return $tooltip.html();
        });

        d3.select('#chart svg')
          .datum(data)
          .call(chart);

        nv.utils.windowResize(chart.update);
      });

      nv.addGraph(function () {
        var chart = nv.models.pieChart()
          .x(function (d) {
            return d.key;
          })
          .y(function (d) {
            return d.value;
          })
          .showLabels(true);

        chart.tooltipContent(function (key, y, e, graph) {
          return (y / 60).round(2) + ' hours';
        });

        d3.select("#monthPie svg")
          .datum(data)
          .transition().duration(350)
          .call(chart);
      });

    });
  }
};

Template.stats.destroyed = function () {
  this.drawStats.stop();
};