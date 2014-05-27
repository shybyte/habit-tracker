Template.habits.helpers({
  habits: function () {
    return Habits.find({}, {sort: {title: 1}});
  },
  categories: function () {
    return Categories.find({}, {sort: {title: 1}});
  },
  isSelectedCategory: function () {
    return (Session.get('selectedCategoryId') || Categories.findOne()._id) == this._id;
  }
});

Template.habits.rendered = function () {
  $('#addHabitPanel').on('shown.bs.collapse', function () {
    $('#title').focus();
  });
};

Template.habits.events({
  'submit form#addHabit': function (event) {
    event.preventDefault();
    var form = event.target;
    var categoryId = form.category.value;

    function addHabit() {
      Meteor.call('addHabit', {
        title: form.title.value,
        category: categoryId
      }, function (error, id) {
        if (error) {
          return alert(error.reason);
        }
      });

      form.title.value = '';
      form.title.focus();
    }

    if (categoryId == 'new') {
      function setSelectedCategoryId() {
        form.categoryTitle.value = '';
        Session.set('selectedCategoryId', categoryId);
        $('#category').val(categoryId).change();
      }
      var newCategoryTitle = form.categoryTitle.value
      var categoryWithNewCategoryTitle = Categories.findOne({title: newCategoryTitle});
      if (categoryWithNewCategoryTitle) {
        categoryId = categoryWithNewCategoryTitle._id;
      } else {
        Meteor.call('addCategory', {
          title: newCategoryTitle
        }, function (error, id) {
          if (error) {
            return alert(error.reason);
          } else {
            categoryId = id;
            setSelectedCategoryId()
            addHabit();
          }
        });
        return
      }
      setSelectedCategoryId();
    }

    addHabit();
  },
  'click .remove': function () {
    event.preventDefault();
    Habits.remove({_id: this._id});
  },
  'change #category': function (event) {
    event.preventDefault();
    var categoryId = event.target.value;
    Session.set('selectedCategoryId', categoryId);
    if (categoryId == 'new') {
      $('#newCategory').show('slow', function () {
        $('#categoryTitle').focus();
      });
    } else {
      $('#newCategory').hide('slow');
    }
  }
});