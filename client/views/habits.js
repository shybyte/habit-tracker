Template.habits.helpers({
  habits: function () {
    return Habbits.find({},{sort:{title: 1}});
  },
  categories: function () {
    return Categories.find({},{sort:{title: 1}});
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
    if (categoryId == 'new') {
      var newCategoryTitle = form.categoryTitle.value
      var categoryWithNewCategoryTitle = Categories.findOne({title: newCategoryTitle});
      if (categoryWithNewCategoryTitle) {
        categoryId = categoryWithNewCategoryTitle._id;
      }  else {
        categoryId = Categories.insert({
          title: newCategoryTitle
        });
      }
      form.categoryTitle.value = '';
      Session.set('selectedCategoryId', categoryId);
      $('#category').val(categoryId).change();
    }
    Habbits.insert({
      title: form.title.value,
      category: categoryId
    });
    form.title.value = '';
    form.title.focus();
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
  },
  'change #category': function (event) {
    event.preventDefault();
    var categoryId = event.target.value;
    Session.set('selectedCategoryId', categoryId);
    if (categoryId == 'new') {
      $('#newCategory').show('slow',function () {
        $('#categoryTitle').focus();
      });
    } else {
      $('#newCategory').hide('slow');
    }
  }
});