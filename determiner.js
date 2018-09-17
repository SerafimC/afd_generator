const utils = require('./utils')

exports.process = function(aAFND, aNT, aT) {
    var aAFD = aAFND;
    this.aNT = aNT;
    this.aT = aT;
    var determinize = true

    while (determinize) {
        determinize = false
        for (let nI = 0; nI < aAFD.length; nI++) {
            process_line(nI);
        }
    }

    return {
        aAFD: aAFD,
        aT: this.aT,
        aNT: this.aNT
    }

    function process_line(nI) {
        let aTransitionRepeat = Array(0)
        for (let nJ = 0; nJ < aAFD[nI].length; nJ++) {

            aTransitionRepeat.push({ symbolName: aAFD[nI][nJ].symbolName, transition: aAFD[nI][nJ].transition, index: nJ })

            for (let nK = nJ + 1; nK < aAFD[nI].length; nK++) {
                if (aAFD[nI][nJ].symbolName == aAFD[nI][nK].symbolName && !utils.Empty(aAFD[nI][nK].symbolName)) {
                    aTransitionRepeat.push({ symbolName: aAFD[nI][nK].symbolName, transition: aAFD[nI][nK].transition, index: nK })
                }
            }

            if (aTransitionRepeat.length > 1) {
                determinize = true
                update_transitions(aTransitionRepeat, nI)
            }

            aTransitionRepeat = Array(0)
        }
    }

    function update_transitions(aTransitionRepeat, nI) {
        let newRule = ''
        let RuleTransitions = Array(0)
        for (let nL = 0; nL < aTransitionRepeat.length; nL++) {
            newRule += aTransitionRepeat[nL].transition + ','
        }

        for (let nM = 0; nM < aAFD[nI].length; nM++) {
            if (!utils.check_existence(aAFD[nI][nM].symbolName, aTransitionRepeat.map((el) => el.symbolName))) {
                RuleTransitions.push({ symbolName: aAFD[nI][nM].symbolName, transition: aAFD[nI][nM].transition })
            }
        }
        // console.log(RuleTransitions)
        RuleTransitions.push({ symbolName: aTransitionRepeat[0].symbolName, transition: newRule })
        aAFD[nI] = RuleTransitions
        aNT.push({ ruleName: newRule, isFinal: false })
        aAFD.push(Array(0))

        add_newRule_transitions(aTransitionRepeat, nI)

        // TODO: Map final new states
    }

    function add_newRule_transitions(aTransitionRepeat, nI) {
        let index = aAFD.length - 1
            // console.log(aTransitionRepeat)
        for (let nJ = 0; nJ < aTransitionRepeat.length; nJ++) {
            let AfID = aNT.findIndex((el) => el.ruleName == aTransitionRepeat[nJ].transition)
                // console.log(aAFD[nI][AfID])
            for (let nK = 0; nK < aAFD[AfID].length; nK++) {
                aAFD[index].push({ symbolName: aAFD[AfID][nK].symbolName, transition: aAFD[AfID][nK].transition })
            }
        }
    }
}