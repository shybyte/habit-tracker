Session.set('actionsColumnLabel', 'Last Action');
Template.track.helpers({
  habits: function () {
    return Habits.find({}, {sort: {title: 1}});
  },
  existHabits: function () {
    return Habits.find().count() > 0;
  },
  actionsColumnLabel: function () {
    return Session.get('actionsColumnLabel');
  }
});

Template.track.rendered = function () {
  $('#addHabitPanel').on('shown.bs.collapse', function () {
    $('#title').focus();
  });
};

Template.track.events({
  'click .actionsColumnMode': function (event) {
    Session.set('actionsColumnLabel', $(event.target).text());
  },
  'click .remove': function () {
    event.preventDefault();
    Meteor.call('removeHabit', this._id, function (error, id) {
      if (error) {
        return alert(error.reason);
      }
    });
  }
});
