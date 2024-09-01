const fs = require('fs');
const path = require('path');
const { Tournament } = require('./tournament.js');

const filePath = path.join(__dirname, 'groups.json');

const data = fs.readFileSync(filePath, 'utf8');
const jsonData = JSON.parse(data);

try {
    const tournament = new Tournament(jsonData);
    tournament.simulateGroupStage();
    tournament.printGroupResults();
} catch (error) {
    console.error('Error:', error.message);
}