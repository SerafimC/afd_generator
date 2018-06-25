const fileService = require('./file_service');
const utils = require('./utils')
const file = 'input.txt';
let aAFND = Array(0), aNT = Array(0), aT = Array(0);

exports.ReadController = function (file) {
    let cInput = fileService.open(file)
    var aLn = ''
    
    for (let i = 0; i < cInput.length; i++){
        for(let j = 0; j < cInput[i].length; j++){
            aLn += cInput[i][j]
        }
        bnf_syntax(aLn)
        aLn= ''
    }
};

/**
 * Loads the AFND table from a line with grammar rule
 * Sets the rules transitions
 * */ 
function bnf_syntax (aLn){
    let oRes = {}
    
    // Defines aNT and aT
    for(let nI = 0; nI < aLn.length; nI++){

        // Found “equal by definition” symbol
        if(aLn[nI] == ':' && aLn[nI+1] == ':' && aLn[nI+2] == '='){
            nI = nI + 3
        }
        // Found rule
        if(aLn[nI] == '<'){ 
            oRes = ready_rule(aLn, nI)
            nI = oRes.nI
        }
        else if(aLn[nI] != '|') { // Found symbol
            oRes = read_symbol(aLn, nI)
            nI = oRes.nI
        }      
    }

    // Ready line and saves the terminals on aT
    function read_symbol(aLn, nI){
        let symbolName = ''
        let oCurrentRule = ready_rule(aLn, 0)
        
        while(aLn[nI] == '' && aLn[nI] == ' '){
            nI++
        }

        symbolName = aLn[nI]

        // Add the symbol to terminals list (aT)
        if(!utils.check_existence(symbolName, aT) && !utils.Empty(symbolName)){ 
            aT.push(symbolName)
        }

        // For each element of the AFNF, verifys if symbol already exists
        // If doesnt, add it
        for(let nJ = 0; nJ < aAFND.length; nJ++){
            if(!utils.Empty(symbolName) && !utils.check_existence(symbolName, aAFND[nJ].map(
                function (el) {
                    return el.symbolName
                })
                )
            ){
                let transition = ready_transition(aLn, nI)
                if(oCurrentRule.ruleName == aNT[nJ]){ 
                    aAFND[nJ].push({symbolName: symbolName, transition: transition})
                }
            }
        }

        return {nI, symbolName}
    }

    // Ready line and saves the non-terminals on aNT
    function ready_rule(aLn, nI){
        let ruleName = ''
        
        nI++
        while(aLn[nI] != '>' && nI < aLn.length){
            ruleName += aLn[nI]
            nI++
        }

        if(!utils.check_existence(ruleName, aNT)){ // Checks if rule exists
            aNT.push(ruleName)
            aAFND.push(Array(0))
        }

        return {nI, ruleName}
    }   

    // Reads the previous or next transition state
    function ready_transition(aLn, nI){
        let destinyState = 'ERROR'

        if(aLn[nI-1] == '>'){
            destinyState = ''
            for(let nJ = nI-2; aLn[nJ] != '<'; nJ--){
                destinyState = aLn[nJ] + destinyState
            }
        } else if (aLn[nI+1] == '<'){
            destinyState = ''
            for(let nJ = nI+2; aLn[nJ] != '>'; nJ++){
                destinyState = destinyState + aLn[nJ]
            }
        }
        return destinyState
    }
}

// EXECUTION
this.ReadController(file)
console.log(aNT)
// console.log(aT)
// console.log(aAFND)
utils.printAF(aAFND, aT, aNT)