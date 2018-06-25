const fileService = require('./file_service');
const utils = require('./utils')
const file = 'input.txt';
const invalidLine = '☨'
let aAFND = Array(0),
    aNT = Array(0),
    aT = Array(0);

/**
 * Read Controller that commands the initial load
 */
exports.ReadController = function(file) {
    let cInput = fileService.open(file)
    let lReadTokens = true
    var aLn = ''

    for (let i = 0; i < cInput.length; i++) {
        for (let j = 0; j < cInput[i].length; j++) {
            aLn += cInput[i][j]
        }

        if (aLn[0] == invalidLine) {
            lReadTokens = false
        }
        if (lReadTokens) {
            read_token(aLn)
        } else if (aLn != invalidLine) {
            bnf_syntax(aLn)
        }
        aLn = ''
    }
    // Adds the final state "END", that contatins the ε transition
    add_finalState()
};

/**
 * Loads the AFND table from a line with grammar rule
 * Sets the rules transitions
 * */
function bnf_syntax(aLn) {
    let oRes = {}

    // Defines aNT and aT
    for (let nI = 0; nI < aLn.length; nI++) {

        // Found “equal by definition” symbol
        if (aLn[nI] == ':' && aLn[nI + 1] == ':' && aLn[nI + 2] == '=') {
            nI = nI + 3
        }
        // Found rule
        if (aLn[nI] == '<') {
            oRes = ready_rule(aLn, nI)
            nI = oRes.nI
        } else if (aLn[nI] != '|') { // Found symbol
            oRes = read_symbol(aLn, nI)
            nI = oRes.nI
        }
    }

    // Ready line and saves the terminals on aT
    // Commands the transition saves
    function read_symbol(aLn, nI) {
        let symbolName = ''
        let oCurrentRule = ready_rule(aLn, 0)

        while (aLn[nI] == '' && aLn[nI] == ' ') {
            nI++
        }

        symbolName = aLn[nI]

        // Add the symbol to terminals list (aT)
        if (!utils.check_existence(symbolName, aT) && !utils.Empty(symbolName)) {
            aT.push(symbolName)
        }

        // For each element of the AFNF, verifys if symbol already exists
        // If doesnt, add it
        for (let nJ = 0; nJ < aAFND.length; nJ++) {
            if (!utils.Empty(symbolName) && !utils.check_existence(symbolName, aAFND[nJ].map(
                    function(el) {
                        return el.symbolName
                    }))) {
                let transition = ready_transition(aLn, nI)
                if (oCurrentRule.ruleName == aNT[nJ]) {
                    if (symbolName == 'ε') {
                        symbolName = ''
                        transition = 'END'
                    }
                    aAFND[nJ].push({ symbolName: symbolName, transition: transition })
                }
            }
        }

        return { nI, symbolName }
    }

    // Ready line and saves the non-terminals on aNT
    function ready_rule(aLn, nI) {
        let ruleName = ''

        nI++
        while (aLn[nI] != '>' && nI < aLn.length) {
            ruleName += aLn[nI]
            nI++
        }

        if (!utils.check_existence(ruleName, aNT)) { // Checks if rule exists
            aNT.push(ruleName)
            aAFND.push(Array(0))
        }

        return { nI, ruleName }
    }

    // Reads the previous or next transition state
    function ready_transition(aLn, nI) {
        let destinyState = 'ERROR'

        if (aLn[nI - 1] == '>') {
            destinyState = ''
            for (let nJ = nI - 2; aLn[nJ] != '<'; nJ--) {
                destinyState = aLn[nJ] + destinyState
            }
        } else if (aLn[nI + 1] == '<') {
            destinyState = ''
            for (let nJ = nI + 2; aLn[nJ] != '>'; nJ++) {
                destinyState = destinyState + aLn[nJ]
            }
        }
        return destinyState
    }
}

/**
 * Reads a given tokens and adds to AFND
 */
function read_token(aLn) {
    for (let nI = 0; nI <= aLn.length; nI++) {

        aT.push('' + aLn[nI] + '')
        aNT.push('' + (aNT.length) + '')
        aAFND.push(Array(0))

        // The last symbol should transit to END state
        if (nI == aLn.length) {
            aAFND[(aAFND.length - 1)].push({ symbolName: '', transition: 'END' })
        } else {
            aAFND[(aAFND.length - 1)].push({ symbolName: '' + aLn[nI] + '', transition: '' + (aNT.length) + '' })
        }
    }
}

/**
 * Creates the final state 'END'
 */
function add_finalState() {
    aNT.push('END')
    aAFND.push([{ symbolName: 'ε', transition: '' }])
}

// EXECUTION
this.ReadController(file)
    // console.log(aNT)
    // console.log(aT)
    // console.log(aAFND)
utils.printAF(aAFND, aT, aNT)