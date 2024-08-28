class Team {
    constructor(name, isoCode, fibaRanking) {
        this.name = name;
        this.isoCode = isoCode;
        this.fibaRanking = fibaRanking;
        this.validate();
    }

    validate() {
        if (typeof this.name !== 'string') {
            throw new Error('Team name should be a string');
        }
        if (typeof this.isoCode !== 'string') {
            throw new Error('ISOCode should be a string');
        }
        if (typeof this.fibaRanking !== 'number') {
            throw new Error('FIBARanking should be a number');
        }
    }
}

module.exports = { Team };