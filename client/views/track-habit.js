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
  },
  'click .removeHabit': function () {
    event.preventDefault();
    if (window.confirm('Do you really want to delete the habit "' + this.title + '" ?')) {
      Meteor.call('removeHabit', this._id, function (error, id) {
        if (error) {
          return alert(error.reason);
        }
      });
    }
  }
});

Template.lastActionTemplate.events({
  'click .removeAction': function (event) {
    event.preventDefault();
    if (window.confirm('Do you really want to delete this action?')) {
      Actions.remove(this._id);
    }
  }
});