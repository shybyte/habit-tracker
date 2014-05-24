Template.habits.helpers({
  habits: function () {
    return Habbits.find();
  },
  categories: function () {
    return Categories.find();
  }
});

Template.habits.events({
  'submit form#addHabit': function (event) {
    event.preventDefault();
    var form = event.target;
    Habbits.insert({
      title: form.title.value,
      category: form.category.value
    });
  },
  'submit form#addCategory': function (event) {
    event.preventDefault();
    var form = event.target;
    Categories.insert({
      title: form.title.value
    });
  },
  'click .remove': function () {
    event.preventDefault();
    Habbits.remove({_id: this._id});
  }
});