const { Group } = require("./group.js");

class Tournament {
  constructor(groupsData) {
    this.groups = this.loadGroups(groupsData);
  }
  generateScore(mean, stdDev, probability) {
    const adjustedMean = mean * (1 + (probability - 0.5));
    return Math.max(
      0,
      Math.round(adjustedMean + stdDev * (Math.random() - 0.5))
    );
  }

  calculateWinningProbability(ratingA, ratingB) {
    return 1 / (1 + Math.pow(10, (ratingB - ratingA) / 400));
  }

  simulateGameWithScore(teamA, teamB) {
    const probabilityA = this.calculateWinningProbability(
      teamA.fibaRanking,
      teamB.fibaRanking
    );
    const whoWon = Math.random() < probabilityA;

    const teamAScore = this.generateScore(80, 30, probabilityA);
    const teamBScore = this.generateScore(80, 30, probabilityA);

    console.log(teamA.name, teamB.name);
    console.log(teamAScore, teamBScore);
    teamA.pointsGiven += teamAScore;
    teamA.pointsConcided += teamBScore;
    teamB.pointsGiven += teamBScore;
    teamB.pointsConcided += teamAScore;

    if (whoWon) {
      teamA.points += 2;
      teamB.points += 1;
    } else {
      teamB.points += 2;
      teamA.points += 1;
    }
  }

  loadGroups(groupsData) {
    const groups = {};
    for (const [groupName, teamsData] of Object.entries(groupsData)) {
      groups[groupName] = new Group(groupName, teamsData);
    }
    return groups;
  }
  createGroupStagePairs(teams) {
    const rounds = [];

    for (let round = 0; round < 3; round++) {
      const shuffledTeams = [...teams].sort(() => Math.random() - 0.5);

      const pairs = [
        [shuffledTeams[0], shuffledTeams[1]],
        [shuffledTeams[2], shuffledTeams[3]],
      ];

      rounds.push(pairs);
    }

    return rounds;
  }

  simulateGroupStage() {
    for (const groupName in this.groups) {
      const group = this.groups[groupName];

      group.teams.forEach((team) => {
        team.points = 0;
        team.pointsGiven = 0;
        team.pointsConcided = 0;
      });

      const rounds = this.createGroupStagePairs(group.teams);

      rounds.forEach((round, roundIndex) => {
        console.log(`Round ${roundIndex + 1} for group ${group.name}:`);
        round.forEach(([teamA, teamB]) => {
          this.simulateGameWithScore(teamA, teamB);
        });
      });

      console.log(`Final table for group ${group.name}:`);
      group.teams.forEach((team) => {
        console.log(
          `${team.name}: ${team.points} points, ${team.pointsGiven} goals scored, ${team.pointsConcided} goals conceded`
        );
      });
      console.log();
    }
  }
}

module.exports = { Tournament };
