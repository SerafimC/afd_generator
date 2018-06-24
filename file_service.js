const fs = require('fs');

function open() {
    fs.open('./input.txt', 'r', (err, fd) => {
        if (err) throw err;
        console.log(fs)
        fs.close(fd, (err) => {
            if (err) throw err;
        });
    })
}
open()

