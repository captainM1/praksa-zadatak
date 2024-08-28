const { Team } = require('./team.js');

class Group {
    constructor(name, teams) {
        this.name = name;
        this.teams = teams.map(teamData => {
            console.log(teamData); // Log the teamData
            return new Team(teamData.Team, teamData.ISOCode, teamData.FIBARanking);
        });
    }
}

module.exports = { Group };
