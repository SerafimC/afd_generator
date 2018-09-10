const utils = require('./utils')

exports.process = function(aAFD, aT, aNT) {
    this.aAFD = aAFD.slice();
    this.aNT = aNT.slice();
    this.aT = aT;
    this.used = Array(["0"]);

    let initialState = 0

    stateTravel.call(this, initialState)

    for (let i = this.aAFD.length - 1; i >= 0; i--) {
        if (!utils.check_existence(aNT[i].ruleName, this.used)) {
            let AfID = this.aNT.findIndex((el) => el.ruleName == aNT[i].ruleName)
            this.aAFD.splice(i, 1)
            this.aNT.splice(AfID, 1)
        }
    }

    return {
        aAFD: this.aAFD,
        aT: this.aT,
        aNT: this.aNT
    }

    function stateTravel(currentState) {
        let state = this.aAFD[currentState]
        for (let i = 0; i < state.length; i++) {
            let nextTransition = state[i].transition;

            if (state[i].symbolName != 'ε') {
                let AfID = this.aNT.findIndex((el) => el.ruleName == nextTransition)
                if (AfID >= 0 && AfID != currentState) {
                    stateTravel.call(this, AfID)
                }
            }

            if (!utils.check_existence(nextTransition, this.used)) {
                this.used.push(nextTransition)
            }

        }
    }
}