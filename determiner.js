const utils = require('./utils')

exports.process = function(aAFND, aNT, aT) {
    var aAFD = aAFND;
    this.aNT = aNT;
    this.aT = aT;

    for (let nI = 0; nI < aAFND.length; nI++) {
        process_line(nI);
    }

    utils.printAF(aAFND, this.aT, this.aNT)

    function process_line(nI) {
        let aTransitionRepeat = Array(0)
        for (let nJ = 0; nJ < aAFND[nI].length; nJ++) {

            aTransitionRepeat.push({ symbolName: aAFND[nI][nJ].symbolName, transition: aAFND[nI][nJ].transition })

            for (let nK = nJ + 1; nK < aAFND[nI].length; nK++) {
                if (aAFND[nI][nJ].symbolName == aAFND[nI][nK].symbolName) {
                    aTransitionRepeat.push({ symbolName: aAFND[nI][nK].symbolName, transition: aAFND[nI][nK].transition })
                }
            }

            if (aTransitionRepeat.length > 1) {
                update_transitions(aTransitionRepeat, nI)
            }

            aTransitionRepeat = Array(0)
        }
    }

    function update_transitions(aTransitionRepeat, nI) {
        let newRule = ''
        let RuleTransitions = Array(0)
        for (let nL = 0; nL < aTransitionRepeat.length; nL++) {
            newRule += aTransitionRepeat[nL].transition
        }
        // console.log(newRule)

        /* TODO: Return only symbol transition to aAFD */
        // for (let nL = 0; nL < aTransitionRepeat.length; nL++) {
        //     if (aTransitionRepeat[nL].symbolName == aAFND[nI][nM].symbolName) {
        //         RuleTransitions.push({ symbolName: aAFND[nI][nM].symbolName, transition: aAFND[nI][nM].transition })
        //     }
        // }
        aAFD[nI] = RuleTransitions
    }
}