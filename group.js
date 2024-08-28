const { Team } = require('./team.js');

class Group {
    constructor(name, teams) {
        this.name = name;
        this.teams = teams.map(teamData => {
            return new Team(teamData.Team, teamData.ISOCode, teamData.FIBARanking);
        });
    }
}

module.exports = { Group };
