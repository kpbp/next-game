var today = new Date().toISOString();
var team = "Tottenham Hotspur FC";
var teamCont = document.querySelector('#team-cont');
var nextGameCont = document.querySelector('#next-game-cont');
var fixtures;
var teams;

function fixturesForTeam(fixtures, team) {
	return _.filter(fixtures, function(f) {
		return f.home === team || f.away === team;
	});
}

function changeTeam(e) {
	team = e.target.textContent;
	writeNextGame();
}

function writeTeams() {
	teams.forEach(function(t) {
		var li = document.createElement('li');
		li.textContent = t;
		li.onclick = changeTeam;
		teamCont.appendChild(li);
	});
}

function writeNextGame() {
	var teamFixtures = fixturesForTeam(fixtures, team);
	var futureFixtures = teamFixtures.filter(function(f) {
		return f.date >= today;
	});
	var nextFixture = futureFixtures[0];
	nextGameCont.querySelector('.next-game-date').innerHTML = new Date(nextFixture.date).toGMTString();
	nextGameCont.querySelector('.next-game-teams').innerHTML = nextFixture.home + ' vs ' + nextFixture.away;	
}

function parseFixtures(json) {
	fixtures = json;
	teams = _(fixtures).pluck('home').uniq().sort().value();
	writeTeams();
	writeNextGame();
}

fetch('data/pl-fixtures.json').then(function(response) {
	return response.json()
}).then(parseFixtures)
.catch(function(ex) {
	console.error('parsing failed', ex)
});
