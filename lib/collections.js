function ownsDocument(userId, doc) {
  return doc && doc.user === userId;
}

Categories = new Meteor.Collection('categories');

Categories.allow({
  update: ownsDocument,
  remove: ownsDocument
});

Meteor.methods({
  addCategory: function(categoryAttributes) {
    var user = Meteor.user();

    if (!user) {
      throw new Meteor.Error(401, "You need to login.");
    }

    var category = _.extend(_.pick(categoryAttributes, 'title'), {
      user: user._id
    });

    return Categories.insert(category);
  }
});


Habits = new Meteor.Collection('habits');
Habits.allow({
  update: ownsDocument
});


Meteor.methods({
  addHabit: function(habitAttributes) {
    var user = Meteor.user();

    if (!user) {
      throw new Meteor.Error(401, "You need to login.");
    }

    var habit = _.extend(_.pick(habitAttributes, 'title', 'category'), {
      user: user._id
    });

    return Habits.insert(habit);
  },
  removeHabit: function (habitId) {
    Habits.remove({_id: habitId});
    Actions.remove({habit: habitId});
  }
});

Actions = new Meteor.Collection('actions');
Actions.allow({
  update: ownsDocument,
  remove: ownsDocument
});


Meteor.methods({
  addAction: function(actionAttributes) {
    var user = Meteor.user();

    if (!user) {
      throw new Meteor.Error(401, "You need to login.");
    }

    var action = _.extend(_.pick(actionAttributes, 'habit', 'duration', 'date'), {
      user: user._id
    });

    return Actions.insert(action);
  }
});