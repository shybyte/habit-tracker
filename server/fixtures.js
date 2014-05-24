(function () {
  if (Habbits.find().count() === 0) {
    var sport = Categories.insert({
      title: 'Sport'
    });

    var music = Categories.insert({
      title: 'Music'
    });

    var sing = Habbits.insert({
      title: 'Practise Singing',
      category: music
    });

    var running = Habbits.insert({
      title: 'Running',
      category: sport
    });

    var bouldern = Habbits.insert({
      title: 'Bouldern',
      category: sport
    });

    Actions.insert({
      habit: sing,
      duration: 15,
      date: moment().subtract('days', 3).toDate()
    });

    Actions.insert({
      habit: sing,
      duration: 30,
      date: moment().subtract('hours', 2).toDate()
    });

    Actions.insert({
      habit: running,
      duration: 70,
      date: moment().subtract('month', 1).toDate()
    });


  }
})();