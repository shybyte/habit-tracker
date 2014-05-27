Template.trackHabit.helpers({
  category: function () {
    return Categories.findOne({_id: this.category});
  },
  lastAction: function () {
    return Actions.findOne({habit: this._id}, {sort: {date: -1}});
  },
  lastWeek: function () {
    return Actions.find({habit: this._id,date: {$gte: moment().subtract('days', 7).toDate()}}, {sort: {date: -1}});
  },
  showLastAction: function () {
    return Session.get('actionsColumnLabel') == 'Last Action';
  },
  showLastWeek: function () {
    return Session.get('actionsColumnLabel') == 'Last Week';
  }
});

Template.trackHabit.events({
  'click .add': function (event) {
    event.preventDefault();

    var action = {
      habit: this._id,
      duration: parseInt(event.target.dataset.duration),
      date: moment().toDate()
    };

    Meteor.call('addAction', action, function(error, id) {
      if (error) {
        return alert(error.reason);
      }
    });

  }
});