'use strict'

var {EntityClient} = require('./client')
var client = new EntityClient();

const {createNewKeyPair} = require("./keys/creator");

const {CryptoFactory, createContext } = require('sawtooth-sdk/signing')
const {Secp256k1PrivateKey, Secp256k1PublicKey} = require('sawtooth-sdk/signing/secp256k1')	
const context = createContext('secp256k1');

const {createTrustAnchor, createJohn, createJill, addTrustEnergistyrelsenToJohn, addTrustJohnToJill, addTrustEnergistyrelsenToJill, createChildrenPropertyForEntity} = require('./submitter');

client.create(createTrustAnchor());
// client.create(createJohn());
// client.create(createJill());

// client.addTrust(addTrustEnergistyrelsenToJohn());
// client.addTrust(addTrustJohnToJill());
// client.addTrust(addTrustEnergistyrelsenToJill());

// client.createChildrenProperty(createChildrenPropertyForEntity("john","wow117"));


// How to verify signature here on the client side
// let trustAnchorInputArray = Buffer.from(trustAnchor.inputPayload, 'base64').toString().split(',');
// var trustAnchorPublicKey = trustAnchorInputArray[1];

// var pk = Secp256k1PublicKey.fromHex(trustAnchorPublicKey);
// var verifyResult = context.verify(jill.signature, jill.inputPayload, pk);
// console.log("Verify result: " + verifyResult);
