const fileService = require('./file_service');
const determiner = require('./determiner')
const utils = require('./utils')
const file = 'input.txt';
const invalidLine = '☨'
let aFD
let aAFND = Array(0), // Starts with the initial state
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

        save_transition_AF(oCurrentRule, symbolName, nI)

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

        if (ruleName == 'S') {
            ruleName = 0
        }

        if (!utils.check_existence(ruleName, aNT.map(function(el) { return el.ruleName }))) { // Checks if rule exists
            aNT.push({ ruleName: ruleName, isFinal: false })
            aAFND.push(Array(0))
        }

        return { nI, ruleName }
    }

    // For each element of the AF, verifys if symbol already exists
    // If doesnt, save it
    function save_transition_AF(oCurrentRule, symbolName, nI) {
        let symbolIndex
        let transition
        for (let nJ = 0; nJ < aAFND.length; nJ++) {
            symbolIndex = aAFND[nJ].findIndex(function(el) {
                return el.symbolName == symbolName
            })
            transition = ready_transition(aLn, nI)

            if (!utils.Empty(symbolName) && validate_transition(aAFND[nJ], symbolIndex, transition)) {
                if (oCurrentRule.ruleName == aNT[nJ].ruleName) {
                    if (symbolName == 'ε') {
                        symbolName = ''
                        transition = 'END'
                        aNT[nJ].isFinal = true
                    }
                    switch (oCurrentRule.ruleName) {
                        case 'S':
                            aAFND[0].push({ symbolName: symbolName, transition: transition })
                            break;
                        default:
                            aAFND[nJ].push({ symbolName: symbolName, transition: transition })
                            break;
                    }

                }
            }
        }

        function validate_transition(el, symbolIndex, transition) {
            if (symbolIndex < 0) {
                return true
            } else {
                return el[symbolIndex].transition != transition
            }
        }
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

        if (destinyState == 'S') {
            return '0'
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

        // creates the initial state
        if (aAFND.length == 0) {
            create_nonTerminal()
        }

        switch (nI) {
            case 0:
                aAFND[0].push({ symbolName: '' + aLn[nI] + '', transition: '' + (aNT.length) + '' })
                break;
            case aLn.length:
                create_nonTerminal()
                aAFND[(aAFND.length - 1)].push({ symbolName: '', transition: 'END' })
                aNT[(aAFND.length - 1)].isFinal = true;
                break;
            default:
                create_nonTerminal()
                aAFND[(aAFND.length - 1)].push({
                    symbolName: '' + aLn[nI] + '',
                    transition: '' + (aNT.length) + ''
                })
        }
    }

    function create_nonTerminal() {
        aNT.push({ ruleName: aNT.length, isFinal: false })
        aAFND.push(Array(0))
    }
}

/**
 * Creates the final state 'END'
 */
function add_finalState() {
    aNT.push({ ruleName: 'END', isFinal: true })
    aAFND.push([{ symbolName: 'ε', transition: '' }])
}

// EXECUTION
this.ReadController(file)
aFD = determiner.process(aAFND, aNT, aT)
    // console.log(aNT)
    // console.log(aT)
    // console.log(aAFND)
    // utils.printAF(aAFND, aT, aNT)