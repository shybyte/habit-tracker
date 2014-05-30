Router.configure({
  layoutTemplate: 'layout',
  loadingTemplate: 'loading',
  waitOn: function () {
    return [Meteor.subscribe('habits')]
  }
});

Router.map(function () {
  this.route('track', {path: '/'});
  this.route('stats', {path: '/stats'});

  this.route('export', {
    where: 'server',
    path: '/export/:userId',
    action: function () {
      var userId = this.params.userId;
      var userSelector = {user: userId};
      var data = {
        categories: Categories.find(userSelector, {fields: {title: 1}}).fetch(),
        habits: Habits.find(userSelector, {fields: {title: 1, category: 1}}).fetch(),
        actions: Actions.find(userSelector, {fields: {habit: 1, date: 1, duration: 1}}).fetch()
      };
      this.response.write(JSON.stringify(data));
      this.response.end();
    }
  });

});

//function requireLogin(pause) {
//  if (!Meteor.user()) {
//    this.render('accessDenied');
//    pause();
//  }
//}
//
//Router.onBeforeAction(requireLogin, {except: 'export'});
//

var requireLogin = function (pause) {
  if (!Meteor.user()) {
    if (Meteor.loggingIn()) {
      this.render(this.loadingTemplate);
    }
    else {
      this.render('accessDenied');
    }

    pause();
  }
}

Router.onBeforeAction('loading');
Router.onBeforeAction(requireLogin, {except: 'export'});

