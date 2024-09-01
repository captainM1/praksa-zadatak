const { Group } = require("./group.js");

class Tournament {
  constructor(groupsData) {
    this.groups = this.loadGroups(groupsData);
  }

  calculateWinningProbability(ratingA, ratingB) {
    return 1 / (1 + Math.exp(-(ratingB - ratingA) / 10));
  }

  generateSkewedScore(expectedScore, skew) {
    const randomOffset = Math.random() * skew - (skew / 2);
    return Math.round(expectedScore + randomOffset);
  }

  simulateGame(ratingA, ratingB, minScore, maxScore) {
    const probA = this.calculateWinningProbability(ratingA, ratingB);
    const probB = 1 - probA;

    const expectedScoreA = minScore + (maxScore - minScore) * probA;
    const expectedScoreB = minScore + (maxScore - minScore) * probB;

    const skew = (maxScore - minScore) * 0.2;

    const scoreA = this.generateSkewedScore(expectedScoreA, skew);
    const scoreB = this.generateSkewedScore(expectedScoreB, skew);

    return { scoreA, scoreB };
  }

  postMatchStats(teamA, teamB,scoreA,scoreB) {
    teamA.pointsGiven += scoreA;
    teamA.pointsConcided += scoreB;
    teamB.pointsGiven += scoreB;
    teamB.pointsConcided += scoreA;

    if (scoreA > scoreB) {
      teamA.wins += 1;
      teamB.loses += 1;
      teamA.points += 2;
      teamB.points += 1;
    } else {
      teamB.wins += 1;
      teamA.loses += 1;
      teamB.points += 2;
      teamA.points += 1;
    }
  }
  simulateGameWithScore(teamA, teamB) {
    const minScore = 60;
    const maxScore = 120;

    const { scoreA, scoreB } = this.simulateGame(teamA.fibaRanking, teamB.fibaRanking, minScore, maxScore);

    console.log(`\t${teamA.name} - ${teamB.name} (${scoreA}:${scoreB})`);
    this.postMatchStats(teamA,teamB,scoreA,scoreB);
  }

  loadGroups(groupsData) {
    const groups = {};
    for (const [groupName, teamsData] of Object.entries(groupsData)) {
      groups[groupName] = new Group(groupName, teamsData);
      this.createGroupStagePairs(groups[groupName].teams);
    }
    return groups;
  }
  createGroupStagePairs(teams) {
    const rounds = [];
    const numTeams = teams.length;

    teams.sort((a, b) => 0.5 - Math.random());

    for (let round = 0; round < numTeams - 1; round++) {
      const pairs = [];

      for (let i = 0; i < numTeams / 2; i++) {
        const team1 = teams[i];
        const team2 = teams[numTeams - 1 - i];
        pairs.push([team1, team2]);
      }

      rounds.push(pairs);

      teams.splice(1, 0, teams.pop());
    }

    return rounds;
  }

  simulateGroupStage() {
    const maxRounds = 3
    const romanNumbers = ["I","II","III","IV"]
    for (let roundIndex = 0; roundIndex < maxRounds; roundIndex++) {
      console.log(`Grupna faza - ${romanNumbers[roundIndex]} kolo:`);
      for (const groupName in this.groups) {
        const group = this.groups[groupName];

        if (group.rounds[roundIndex]) {
          console.log(`Grupa ${group.name}:`);
          group.rounds[roundIndex].forEach(([teamA, teamB]) => {
            this.simulateGameWithScore(teamA, teamB);
          });
        }
      }
    }
  }
  
  printGroupResults(){
    console.log("Konačan plasman u grupama:")
    for (const groupName in this.groups) {
      const group = this.groups[groupName];
      console.log(`Grupa ${group.name}:`);

      const sortedTeams = group.teams.sort((a, b) => b.points - a.points);

      let index = 1;
      sortedTeams.forEach((team) => {
        console.log(
          `\t${index}. ${team.name}   ${team.wins} / ${team.loses} / ${team.points} / ${team.pointsGiven} / ${team.pointsConcided} / ${team.pointsGiven - team.pointsConcided}`
        );
        index+=1;
      });

      console.log();
    }
  }
}

module.exports = { Tournament };
