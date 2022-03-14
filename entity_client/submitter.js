const {TransactionPayload, TransactionAction, CreateActionParameters, AddTrustActionParameters, CreateChildrenPropertyActionParameters, UseChildrenPropertyActionParameters} = require('entity_shared/types');
const fs = require('fs')

const {CryptoFactory, createContext } = require('sawtooth-sdk/signing')
const {Secp256k1PrivateKey} = require('sawtooth-sdk/signing/secp256k1')	
const context = createContext('secp256k1');

function readFromFile(filename) {
    var file = './keys/'+filename;
    return fs.readFileSync(file);
}

module.exports = {
    createTrustAnchor,
    createJohn,
    createJill,
    addTrustEnergistyrelsenToJohn,
    addTrustJohnToJill,
    addTrustEnergistyrelsenToJill,
    createChildrenPropertyForEntity,
    useChildrenPropertyForEntity
}


function createTrustAnchor() {
    let fileName = "energistyrelsen";
    let ownerName = "trust-anchor";
    let affectedEntity = "Energistyrelsen";

    return createCreateAction(affectedEntity, ownerName, fileName);
}

function createJohn() {
    let fileName = "john";
    let ownerName = "Energistyrelsen";
    let affectedEntity = "john";

    return createCreateAction(affectedEntity, ownerName, fileName);
}

function createJill() {
    let fileName = "jill";
    let ownerName = "john";
    let affectedEntity = "jill";

    return createCreateAction(affectedEntity, ownerName, fileName);
}

function addTrustEnergistyrelsenToJohn() {
    let signer = "Energistyrelsen";
    let affectedEntity = "john";

    return createAddTrustAction(affectedEntity, signer);
}

function addTrustJohnToJill() {
    let signer = "john";
    let affectedEntity = "jill";

    return createAddTrustAction(affectedEntity, signer);
}

function addTrustEnergistyrelsenToJill() {
    let signer = "Energistyrelsen";
    let affectedEntity = "jill";

    return createAddTrustAction(affectedEntity, signer);
}

function createChildrenPropertyForEntity(affectedEntity, propertyName) {
    return createCreateChildrenParameterAction(affectedEntity, affectedEntity, propertyName);
}

function useChildrenPropertyForEntity(affectedEntity, signer, propertyName, propertyValue) {
    return createUseChildrenParameterAction(affectedEntity, signer, propertyName, propertyValue);
}

function createCreateAction(affectedEntity, ownerName, publicKeyFilename) {
    var createActionParameters = new CreateActionParameters(readFromFile(publicKeyFilename.toLowerCase() + ".pub"));
    var action = new TransactionAction(ownerName, "create", affectedEntity, createActionParameters);

    let privateKeyStr = readFromFile(ownerName.toLowerCase() + ".priv").toString().trim();
    const privateKey = Secp256k1PrivateKey.fromHex(privateKeyStr);

    var encodedAction = action.toBuffer().toString("base64");
    var signature = context.sign(encodedAction, privateKey);
    var transactionPayload = new TransactionPayload(encodedAction, signature);
    return transactionPayload;
}

function createAddTrustAction(affectedEntity, ownerName) {
    var addTrustActionParameters = new AddTrustActionParameters();
    var action = new TransactionAction(ownerName, "add-trust", affectedEntity, addTrustActionParameters);

    let privateKeyStr = readFromFile(ownerName.toLowerCase() + ".priv").toString().trim();
    const privateKey = Secp256k1PrivateKey.fromHex(privateKeyStr);

    var encodedAction = action.toBuffer().toString("base64");
    var signature = context.sign(encodedAction, privateKey);
    var transactionPayload = new TransactionPayload(encodedAction, signature);
    return transactionPayload;
}

function createCreateChildrenParameterAction(affectedEntity, ownerName, propertyName) {
    var createChildrenPropertyActionParameters = new CreateChildrenPropertyActionParameters(propertyName);
    var action = new TransactionAction(ownerName, "create-children-property", affectedEntity, createChildrenPropertyActionParameters);

    let privateKeyStr = readFromFile(ownerName.toLowerCase() + ".priv").toString().trim();
    const privateKey = Secp256k1PrivateKey.fromHex(privateKeyStr);

    var encodedAction = action.toBuffer().toString("base64");
    var signature = context.sign(encodedAction, privateKey);
    var transactionPayload = new TransactionPayload(encodedAction, signature);
    return transactionPayload;
}

function createUseChildrenParameterAction(affectedEntity, signer, propertyName, propertyValue) {
    var useChildrenPropertyActionParameters = new UseChildrenPropertyActionParameters(propertyName, propertyValue);
    var action = new TransactionAction(signer, "use-children-property", affectedEntity, useChildrenPropertyActionParameters);

    let privateKeyStr = readFromFile(signer.toLowerCase() + ".priv").toString().trim();
    const privateKey = Secp256k1PrivateKey.fromHex(privateKeyStr);

    var encodedAction = action.toBuffer().toString("base64");
    var signature = context.sign(encodedAction, privateKey);
    var transactionPayload = new TransactionPayload(encodedAction, signature);
    return transactionPayload;
}