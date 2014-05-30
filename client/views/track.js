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


Template.addActionDialog.helpers({
  currentHabit: function () {
    return Session.get('currentHabit');
  }
});

Template.addActionDialog.rendered = function () {
  $('.datetimePicker').datetimepicker({
    defaultDate: new Date(),
    pick12HourFormat: false,
    minuteStepping: 5,
    sideBySide: true,
    showToday: true,
    format: 'DD MMM H:mm'
  });
  $('.durationPicker').datetimepicker({
    defaultDate: moment().minutes(0).hours(0),
    pickDate: false,
    pickTime: true,
    minuteStepping: 5,
    pick12HourFormat: false,
    format: 'HH:mm'
  });

};

function getMoment(selector) {
  return $(selector).data('DateTimePicker').getDate();
}

Template.addActionDialog.events({
  'click .addAction': function () {
    $('form#addActionForm').submit();
  },
  'submit #addActionForm': function (event) {
    event.preventDefault();
    var durationMoment = getMoment('.durationPicker');
    var action = {
      habit: Session.get('currentHabit')._id,
      duration: durationMoment.hours() * 60 + durationMoment.minutes(),
      date: getMoment('.datetimePicker').toDate()
    };
    console.log(action);
    Meteor.call('addAction', action, function (error, id) {
      if (error) {
        return alert(error.reason);
      }
      $('#addActionDialog').modal('hide')
    });
  },
  'shown.bs.modal #addActionDialog': function () {
    var now = moment();
    var startMoment = now.clone().minutes(Math.floor(now.minutes() / 5) * 5);
    $('.datetimePicker').data("DateTimePicker").setDate(startMoment);
    $('#durationPicker input').focus();
  }
});
