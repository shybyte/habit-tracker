Router.configure({
  layoutTemplate: 'layout'
});

Router.map(function() {
  this.route('track', {path: '/'});
  this.route('habits', {path: '/habits'});
  this.route('stats', {path: '/stats'});
});

function requireLogin(pause) {
  if (! Meteor.user()) {
    this.render('accessDenied');
    pause();
  }
}

Router.onBeforeAction(requireLogin);