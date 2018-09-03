const utils = require('./utils')

exports.map = function(aAFD, aT, aNT) {
    this.aAFD = aAFD.slice();
    this.aNT = aNT.slice();
    this.aT = aT;
    this.used = Array(["0"]);

    for (let i = 0; i < this.aAFD.length; i++) {
        let state = this.aAFD[i]
        for (let j = 0; j < this.aT.length; j++) {
            let idTerminal = state.findIndex((el) => el.symbolName == this.aT[j])
            if (idTerminal < 0 && this.aT[j] != 'undefined' && this.aT[j] != 'ε') {
                this.aAFD[i].push({ symbolName: this.aT[j], transition: 'ErrorState' })
            }
        }
    }

    createErrorState.call(this)

    return {
        aAFD: this.aAFD,
        aT: this.aT,
        aNT: this.aNT
    }

    function createErrorState() {
        let idErrorState = this.aAFD.length
        this.aAFD.push(Array(0))
        this.aNT.push({ ruleName: 'ErrorState', isFinal: true })

        for (let j = 0; j < this.aT.length; j++) {
            let idTerminal = this.aAFD[idErrorState].findIndex((el) => el.symbolName == this.aT[j])
            if (idTerminal < 0 && this.aT[j] != 'undefined' && this.aT[j] != 'ε')
                this.aAFD[idErrorState].push({ symbolName: this.aT[j], transition: 'ErrorState' })
        }
    }
}