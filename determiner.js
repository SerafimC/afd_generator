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

            aTransitionRepeat.push({ symbolName: aAFND[nI][nJ].symbolName, transition: aAFND[nI][nJ].transition, index: nJ })

            for (let nK = nJ + 1; nK < aAFND[nI].length; nK++) {
                if (aAFND[nI][nJ].symbolName == aAFND[nI][nK].symbolName) {
                    aTransitionRepeat.push({ symbolName: aAFND[nI][nK].symbolName, transition: aAFND[nI][nK].transition, index: nK })
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
            newRule += aTransitionRepeat[nL].transition + ','
        }

        // for (let nL = 0; nL < aAFND[nI].length; nL++) {
        //     if (!utils.check_existence(aAFND[nI][nL].symbolName, aTransitionRepeat.map((el) => el.symbolName))) {
        //         RuleTransitions.push(aAFND[nI][nL])
        //     }
        // }
        for (let nM = 0; nM < aAFND[nI].length; nM++) {
            if (!utils.check_existence(aAFND[nI][nM].symbolName, aTransitionRepeat.map((el) => el.symbolName))) {
                RuleTransitions.push({ symbolName: aAFND[nI][nM].symbolName, transition: aAFND[nI][nM].transition })
            }
        }
        RuleTransitions.push({ symbolName: aTransitionRepeat[0].symbolName, transition: newRule })
        aAFD[nI] = RuleTransitions
        aNT.push({ ruleName: newRule, isFinal: false })
        aAFD.push(Array(0))
            // console.log(RuleTransitions)

        add_newRule_transitions(aTransitionRepeat, nI)
    }

    function add_newRule_transitions(aTransitionRepeat, nI) {
        let index = aAFD.length - 1
        console.log(aTransitionRepeat)
        for (let nJ = 0; nJ < aTransitionRepeat.length; nJ++) {
            let AfID = aNT.findIndex((el) => el.ruleName == aTransitionRepeat[nJ].transition)
                // console.log(aAFD[nI][AfID])
            for (let nK = 0; nK < aAFD[AfID].length; nK++) {
                aAFD[index].push({ symbolName: aAFD[AfID][nK].symbolName, transition: aAFD[AfID][nK].transition })
            }
        }
    }
}