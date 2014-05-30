Template.addHabit.helpers({
  categories: function () {
    return Categories.find({}, {sort: {title: 1}});
  },
  isSelectedCategory: function () {
    return (Session.get('selectedCategoryId') || Categories.findOne()._id) == this._id;
  }
});

Template.addHabitDialog.events({
  'click .saveHabitButton': function () {
    $('form#addHabit').submit();
  },
  'shown.bs.modal #addHabitDialog': function () {
    $('#title').focus();
  }
});

Template.addHabit.events({
  'submit form#addHabit': function (event) {
    event.preventDefault();
    var form = event.target;
    var categoryId = form.category.value;

    function addHabit() {
      Meteor.call('addHabit', {
        title: form.title.value,
        category: categoryId,
        user: Meteor.user()._id
      }, function (error, id) {
        if (error) {
          return alert(error.reason);
        }
        $('#addHabitDialog').modal('hide');
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
})