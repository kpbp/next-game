var today = new Date().toISOString();
var team = localStorage.team || 'spurs';
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
	team = localStorage.team = e.currentTarget.dataset.team;
	writeNextGame();
}

function writeTeams() {
	teams.forEach(function(t) {
		var li = document.createElement('li');
            var img = document.createElement('img');
            img.src = 'images/crests/' + t + '.png';
		li.onclick = changeTeam;
            li.className = 'team-crest';
            li.setAttribute('data-team', t);
            li.appendChild(img);
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
	nextGameCont.querySelector('.next-game-teams').innerHTML =
            "<img class='team-crest team-home' src='images/crests/" + nextFixture.home + ".png'></img>" +
            "<span class='vs'>vs</span>" +
            "<img class='team-crest team-away' src='images/crests/" + nextFixture.away + ".png'></img>";
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