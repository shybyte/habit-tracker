Template.stats.rendered = function () {
  var self = this;
  if (!self.drawStats) {
    self.drawStats = Meteor.autorun(function () {
      var lastMonthActions = Actions.find({
        date: {$gte: moment().subtract('days', 31).toDate()}
      }, {sort: {date: -1}}).fetch();

      var lastMonthRange = Number.range(31, 0).every();
      var actionsByCategory = lastMonthActions.groupBy(function (action) {
        return Habbits.findOne({_id: action.habit}).category;
      });
      var now = moment();
      var data = Object.keys(actionsByCategory).map(function (categoryId) {
        return {
          values: lastMonthRange.map(function (daysAgo) {
            var dayX = moment(now).subtract('days', daysAgo);
            var actionsOnDayX = actionsByCategory[categoryId].filter(function (action) {
              return moment(action.date).dayOfYear() == dayX.dayOfYear();
            });
            return {x: dayX.toDate(), y: actionsOnDayX.sum('duration')}
          }),
          key: categoryId
        };
      }).map(function (dataSet) {
        dataSet.key = Categories.findOne({_id: dataSet.key}).title;
        return dataSet
      });

      nv.addGraph(function () {
        var chart = nv.models.multiBarChart().stacked(true)
          .transitionDuration(350)
          .reduceXTicks(true)   //If 'false', every single x-axis tick label will be rendered.
          .rotateLabels(0)      //Angle to rotate x-axis labels.
          .showControls(true)   //Allow user to switch between 'Grouped' and 'Stacked' mode.
          .groupSpacing(0.1);    //Distance between each group of bars.

        chart.xAxis
          .tickFormat(function (d) {
            return d3.time.format('%a %e %b')(d)
          });

        chart.yAxis
          .tickFormat(d3.format(',.1f'));

        d3.select('#chart svg')
          .datum(data)
          .call(chart);

        nv.utils.windowResize(chart.update);
      });

    });
  }
};

Template.stats.destroyed = function () {
  this.drawStats.stop();
};