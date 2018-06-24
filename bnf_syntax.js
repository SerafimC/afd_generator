let fileService = require('./file_service');
let utils = require('./utils')
let aAFND = Array(0), aNT = Array(0), aT = Array(0);
let file = 'input.txt';

exports.ReadController = function (file) {
    let cInput = fileService.open(file)
    var aLn = ''
    
    for (let i = 0; i < cInput.length; i++){
        for(let j = 0; j < cInput[i].length; j++){
            aLn += cInput[i][j]
        }
        this.bnf_syntax(aLn)
    }
    // this.setTransitions(aAFND, aNT, aT)
};

exports.setTransitions = function(aAFND, aNT, aT){
    
    // Defines aANFD table
    for(let nI = 0; nI < aNT.length; nI++){
        aAFND.push(Array(0))
        for(nJ = 0; nJ < aT.length; nJ++){
            aAFND[nI].push('ERROR')
        }
    }

    // // Read definition
    function read_definition(aLn, nI){
        let oRes = {}
        if(aLn[nI] == '<'){ 
            oRes = ready_rule(aLn, nI)
            nI = oRes.nI
            aAFND[nRule][nSymbol] = aNT.indexOf(oRes.ruleName)
        }
        else if(aLn[nI] != '|'){
            oRes = read_symbol(aLn, nI)
            nI = oRes.nI
            nSymbol = aT.indexOf(oRes.symbolName)
        }
        return {nI}
    }

    // Defines transitions rules
    for(nI = 0; nI < aLn.length; nI++){

        // Found “equal by definition” symbol 
        if(aLn[nI] == ':' && aLn[nI+1] == ':' && aLn[nI+2] == '='){
            nI = nI + 3
            lDefinition = true
        }
        else if(lDefinition){  // Navigates throw the definition of the symbol          
            oRes = read_definition(aLn, nI)
            nI = oRes.nI
        } 
    }
}

/**
 * Loads the AFND table from a line with grammar rule
 * Sets the rules transitions
 * */ 
exports.bnf_syntax = function(aLn){
    let nJ, nRule = 0, nSymbol = 0
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
        
        while(aLn[nI] == '' && aLn[nI] == ' '){
            nI++
        }

        symbolName = aLn[nI]

        if(!utils.check_existence(symbolName, aT) && !utils.Empty(symbolName)){ // Checks if symbol exists
            aT.push(symbolName)
        }
        for(let nJ = 0; nJ < aAFND.length; nJ++){
            if(!utils.Empty(symbolName) && !utils.check_existence(symbolName, aAFND[nJ].map(
                function (el) {
                    return el.symbolName
                })
                )
            ){
                aAFND[nJ].push({symbolName: symbolName, transition: 'ERROR'})
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
}

// EXECUTION
this.ReadController(file)
// console.log(aNT)
// console.log(aT)
// console.log(aAFND)
utils.printAF(aAFND, aT, aNT)