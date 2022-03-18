
const fs = require('fs')
const { createContext } = require('sawtooth-sdk/signing')

function createNewKeyPair(name) {
    const context = createContext('secp256k1');
    var newPrivateKey = context.newRandomPrivateKey();
    var newPublicKey = context.getPublicKey(newPrivateKey);
    writeFile("./keys/" + name + ".priv", newPrivateKey.asHex());
    writeFile("./keys/" + name + ".pub", newPublicKey.asHex());
}

function writeFile(filename, content) {
    fs.writeFile(filename, content, err => {
        if (err) {
            console.error(err)
            return
        }
        //file written successfully
    });
}

module.exports = {
    createNewKeyPair
}