Template.trackHabit.helpers({
  category: function () {
    return Categories.findOne({_id: this.category});
  },
  lastAction: function () {
    return Actions.findOne({habit: this._id}, {sort: {date: -1}});
  },
  lastWeek: function () {
    return Actions.find({habit: this._id, date: {$gte: moment().subtract('days', 7).toDate()}}, {sort: {date: -1}});
  },
  showLastAction: function () {
    return Session.get('actionsColumnLabel') == 'Last Action';
  },
  showLastWeek: function () {
    return Session.get('actionsColumnLabel') == 'Last Week';
  }
});

Template.trackHabit.events({
  'click .editHabitDialog': function (event) {
    event.preventDefault();
    Session.set('currentHabit', this);
    $('#editHabitDialog').modal('show');
  },
  'click .showAddActionDialog': function (event) {
    event.preventDefault();
    $('#addActionDialog').modal({});
    Session.set('currentHabit', this);
  }

});
