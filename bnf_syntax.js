

function bnf_syntax(){
    let cGr1 = '<S>::= a<A> |b<B> | ε ' // Line with grammar rule
    let aLn, aAFND = Array(), aNT = Array(0), aT = Array(0)
    let nI, nJ, nRule = 0, nSymbol = 0
    let oRes = {}
    let lDefinition = false

    aLn = cGr1.split('')

    // Defines aNT and aT
    for(nI = 0; nI < aLn.length; nI++){

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

    // Defines aANFD table
    for(nI = 0; nI < aNT.length; nI++){
        aAFND.push(Array(0))
        for(nJ = 0; nJ < aNT.length; nJ++){
            aAFND[nI].push(99)
        }
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

    // Ready line and saves the terminals on aT
    function read_symbol(aLn, nI){
        let symbolName = ''
        let nJ
        
        while(aLn[nI] == '' && aLn[nI] == ' '){
            nI++
        }

        symbolName = aLn[nI]

        if(!check_existence(symbolName, aT) && !Empty(symbolName)){ // Checks if symbol exists
            aT.push(symbolName)
        }

        return {nI, symbolName}
    }

    // Ready line and saves the non-terminals on aNT
    function ready_rule(aLn, nI){
        let ruleName = ''
        let nJ
        
        nI++
        while(aLn[nI] != '>' && nI < aLn.length){
            ruleName += aLn[nI]
            nI++
        }

        if(!check_existence(ruleName, aNT)){ // Checks if rule exists
            aNT.push(ruleName)
        }

        return {nI, ruleName}
    }

    // Verify if cName exists on aDT
    // Returns true or false
    function check_existence(cName, aDt){
        let lFound = false

        for(nJ = 0; nJ < aDt.length; nJ++){
            if(cName == aDt[nJ])
                lFound = true
        }

        return lFound
    }        
 
    // Verifys if 'any' is empty ('' or ' ')
    function Empty(any){
        if(any == '' || any == ' ')
            return true
        else
            return false
    }

    console.log(aNT)
    console.log(aT)
    console.log(aAFND)
}
