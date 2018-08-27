const fs = require('fs');
let aCont, aRs;
let aLn = Array(0),
    aTxt = Array(0);

exports.open = function(file) {
    aCont = fs.readFileSync(file, 'utf8');
    aRs = aCont.split('')

    for (i = 0; i < aRs.length; i++) {

        if (aRs[i] == '\n') {
            aTxt.push(aLn)
            aLn = Array(0)
            i = i + 1;
        }
        aLn.push(aRs[i])
    }
    aTxt.push(aLn)
    return aTxt
};

exports.write = function(file, cLn) {
    let data = fs.readFileSync(file, 'utf-8');

    data += cLn + '\r\n'

    fs.writeFileSync(file, data, 'utf-8');
}

exports.clear = function(file) {
    let data = fs.readFileSync(file, 'utf-8');

    data = ''

    fs.writeFileSync(file, data, 'utf-8');
}