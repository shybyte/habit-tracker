Meteor.publish('categories', function() {
  return Categories.find({user: this.userId});
});

Meteor.publish('habits', function() {
  return Habits.find({user: this.userId});
})

Meteor.publish('actions', function() {
  return Actions.find({user: this.userId});
})