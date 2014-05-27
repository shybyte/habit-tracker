Accounts.onLogin(function (options) {
  var userId = options.user._id;

  if (Categories.find({user: userId}).fetch().length > 0) {
    return;
  }

  var sport = Categories.insert({
    title: 'Sport',
    user: userId
  });

  var music = Categories.insert({
    title: 'Music',
    user: userId
  });

  if (true) {
    return;
  }

  var singing = Habits.insert({
    title: 'Practise Singing',
    category: music,
    user: userId
  });

  var running = Habits.insert({
    title: 'Running',
    category: sport,
    user: userId
  });

  var bouldern = Habits.insert({
    title: 'Bouldern',
    category: sport,
    user: userId
  });

  (15).times(function () {
    Actions.insert({
      habit: singing,
      duration: Number.random(15, 60),
      date: moment().subtract('day', Number.random(1, 40)).toDate(),
      user: userId
    });
    Actions.insert({
      habit: running,
      duration: Number.random(15, 60),
      date: moment().subtract('day', Number.random(1, 40)).toDate(),
      user: userId
    });
    Actions.insert({
      habit: bouldern,
      duration: Number.random(15, 60),
      date: moment().subtract('day', Number.random(1, 40)).toDate(),
      user: userId
    });
  });
});