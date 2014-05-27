Meteor.publish('categories', function() {
  return Categories.find();
});

Meteor.publish('habits', function() {
  return Habits.find();
})

Meteor.publish('actions', function() {
  return Actions.find();
})