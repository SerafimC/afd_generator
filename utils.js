let fileService = require('./file_service');

// Verifys if 'any' is empty ('' or ' ')
exports.Empty = function(any) {
    if (any == '' || any == ' ')
        return true
    else
        return false
}

// Verify if cName exists on aDT
// Returns true or false
exports.check_existence = function(cName, aDt) {
    let lFound = false

    for (nJ = 0; nJ < aDt.length; nJ++) {
        if (cName == aDt[nJ])
            lFound = true
    }

    return lFound
}

exports.printAF = function(aAF, aT, aNT) {
    let cLn = ''
    fileService.clear('./output.txt')
    for (let nI = 0; nI < aAF.length; nI++) {
        cLn += '<'
        if (aNT[nI].isFinal) {
            cLn += '*'
        }
        cLn += aNT[nI].ruleName + '>' + ' ::= '
        for (let nJ = 0; nJ < aAF[nI].length; nJ++) {
            cLn += aAF[nI][nJ].symbolName + '<' + aAF[nI][nJ].transition + '> | '
        }
        fileService.write('./output.txt', cLn);
        cLn = ''
    }
}