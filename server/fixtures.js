(function () {
  if (Habits.find().count() === 0) {
    var sport = Categories.insert({
      title: 'Sport'
    });

    var music = Categories.insert({
      title: 'Music'
    });

    var singing = Habits.insert({
      title: 'Practise Singing',
      category: music
    });

    var running = Habits.insert({
      title: 'Running',
      category: sport
    });

    var bouldern = Habits.insert({
      title: 'Bouldern',
      category: sport
    });

    (15).times(function () {
      Actions.insert({
        habit: singing,
        duration: Number.random(15,60),
        date: moment().subtract('day', Number.random(1,40)).toDate()
      });
      Actions.insert({
        habit: running,
        duration: Number.random(15,60),
        date: moment().subtract('day', Number.random(1,40)).toDate()
      });
      Actions.insert({
        habit: bouldern,
        duration: Number.random(15,60),
        date: moment().subtract('day', Number.random(1,40)).toDate()
      });
    });

  }
})();