Session.set('actionsColumnLabel', 'Last Action');

Template.track.helpers({
  habits: function () {
    return Habbits.find({}, {sort: {title: 1}});
  },
  actionsColumnLabel: function () {
    return Session.get('actionsColumnLabel');
  }
});

Template.track.events(
  {
    'click .actionsColumnMode': function (event) {
      Session.set('actionsColumnLabel', $(event.target).text());
    }
  }
)
;