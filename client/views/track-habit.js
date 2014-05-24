Template.trackHabit.helpers({
  category: function () {
    return Categories.findOne({_id: this.category});
  },
  lastAction: function () {
    return Actions.findOne({habit: this._id}, {sort: {date: -1}});
  }
});

Template.trackHabit.events({
  'click .add': function (event) {
    event.preventDefault();
    Actions.insert({
      habit: this._id,
      duration: parseInt(event.target.dataset.duration),
      date: moment().toDate()
    });
  }
});