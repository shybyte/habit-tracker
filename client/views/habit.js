Template.habit.helpers({
  category: function () {
    return Categories.findOne({_id: this.category});
  },
  lastAction: function () {
    return Actions.findOne({habit: this._id}, {sort: {date: 1}});
  }
});