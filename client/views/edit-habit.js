Template.editHabit.helpers({
  categories: function () {
    return Categories.find({}, {sort: {title: 1}});
  },
  isSelectedCategory: function () {
    var currentHabit = Session.get('currentHabit');
    var categoryId = currentHabit ? Categories.findOne({_id: currentHabit.category})._id :
      (Session.get('selectedCategoryId') || Categories.findOne()._id);
    console.log(categoryId == this._id);
    return categoryId == this._id;
  },
  currentHabit: function () {
    return Session.get('currentHabit');
  }
});

Template.editHabitDialog.helpers({
  currentHabit: function () {
    return Session.get('currentHabit');
  }
});

Template.editHabitDialog.events({
  'click .saveHabitButton': function () {
    $('form#editHabit').submit();
  },
  'shown.bs.modal #editHabitDialog': function () {
    $('#title').focus();
  }
});

Template.editHabit.events({
  'submit form#editHabit': function (event) {
    event.preventDefault();
    var form = event.target;
    var categoryId = form.category.value;

    function editHabit() {
      Meteor.call('saveHabit', {
        _id: Session.get('currentHabit') ? Session.get('currentHabit')._id : null,
        title: form.title.value,
        category: categoryId,
        user: Meteor.user()._id
      }, function (error, id) {
        if (error) {
          return alert(error.reason);
        }
        $('#editHabitDialog').modal('hide');
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
            editHabit();
          }
        });
        return
      }
      setSelectedCategoryId();
    }

    editHabit();
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