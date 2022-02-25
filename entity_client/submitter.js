const { Entity, EntityTransaction, TrustEntity } = require('./types')
const fs = require('fs')

const {CryptoFactory, createContext } = require('sawtooth-sdk/signing')
const {Secp256k1PrivateKey} = require('sawtooth-sdk/signing/secp256k1')	
const context = createContext('secp256k1');

function createTrustAnchor() {
    return createEntityTransaction('Energistyrelsen', 'energistyrelsen','trust-anchor','create');
}

function createJill() {
    return createEntityTransaction('jill', 'jill','Energistyrelsen','create');
}

function createJohn() {
    return createEntityTransaction('john', 'john','Energistyrelsen','create');
}

function createEnergistyrelsenToJillTrust() {
    return createTrustEntityTransaction('jill', 'Energistyrelsen', 'add-trust');
}

function createJohnToJillTrust() {
    return createTrustEntityTransaction('jill', 'john', 'add-trust');
}

function createEntity(name, fileName, ownerName, action) {
    return new Entity(name, readFromFile(fileName + ".pub"), ownerName, action);
}

function createTrustEntity(receiver, trustedBy, action) {
    return new TrustEntity(receiver, trustedBy, action);
}

function createEntityTransaction(name, fileName, ownerName, action) {
    let privateKeyStr = readFromFile(ownerName.toLowerCase() + ".priv").toString().trim();
    const privateKey = Secp256k1PrivateKey.fromHex(privateKeyStr);

    const entity = createEntity(name, fileName, ownerName, action);
    let entityPayload = entity.toBase64();
    const signature = context.sign(entityPayload, privateKey);
    return new EntityTransaction(entityPayload, signature, ownerName, action, name);
}

function createTrustEntityTransaction(receiver, trustedBy, action) {
    let privateKeyStr = readFromFile(trustedBy.toLowerCase() + ".priv").toString().trim();
    const privateKey = Secp256k1PrivateKey.fromHex(privateKeyStr);

    const trustEntity = createTrustEntity(receiver, trustedBy, action);
    let trustEntityPayload = trustEntity.toBase64();
    const signature = context.sign(trustEntityPayload, privateKey);
    return new EntityTransaction(trustEntityPayload, signature, trustedBy, action, receiver);
}

function readFromFile(filename) {
    var file = './keys/'+filename;
    return fs.readFileSync(file);
}

module.exports = {
    createTrustAnchor,
    createJill,
    createJohn,
    createEnergistyrelsenToJillTrust,
    createJohnToJillTrust
}