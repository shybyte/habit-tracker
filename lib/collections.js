function ownsDocument(userId, doc) {
  return doc && doc.user === userId;
}

Categories = new Meteor.Collection('categories');

Categories.allow({
  update: ownsDocument,
  remove: ownsDocument
});

Meteor.methods({
  addCategory: function (categoryAttributes) {
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
  saveHabit: function (habitAttributes) {
    var user = Meteor.user();

    if (!user) {
      throw new Meteor.Error(401, "You need to login.");
    }


    var habit = _.extend(_.pick(habitAttributes, '_id', 'title', 'category'), {
      user: user._id
    });

    if (habit._id && Habits.findOne({_id: habit._id})) {
      var existingHabit = Habits.findOne({_id: habit._id});
      if (existingHabit.user == user._id) {
        return Habits.update({_id: habit._id}, habit);
      } else {
        throw new Meteor.Error(403, "You can't edit stuff from other users.");
      }
    } else {
      delete habit._id;
      return Habits.insert(habit);
    }

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
  addAction: function (actionAttributes) {
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