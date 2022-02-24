'use strict'

var {EntityClient} = require('./client')
var client = new EntityClient();

var {createTrustAnchor, createJill, createJohn} = require('./submitter');
const {createNewKeyPair} = require("./keys/creator");

const {CryptoFactory, createContext } = require('sawtooth-sdk/signing')
const {Secp256k1PrivateKey, Secp256k1PublicKey} = require('sawtooth-sdk/signing/secp256k1')	
const context = createContext('secp256k1');


var trustAnchor = createTrustAnchor();
var jill = createJill();
var john = createJohn();

// var entityTransaction = trustAnchor;
// client.create(entityTransaction.inputPayload, entityTransaction.signature, entityTransaction.ownerName, entityTransaction.name);
// var entityTransaction = jill;
// client.create(entityTransaction.inputPayload, entityTransaction.signature, entityTransaction.ownerName, entityTransaction.name);
var entityTransaction = john;
client.create(entityTransaction.inputPayload, entityTransaction.signature, entityTransaction.ownerName, entityTransaction.name);



// How to verify signature here on the client side
// let trustAnchorInputArray = Buffer.from(trustAnchor.inputPayload, 'base64').toString().split(',');
// var trustAnchorPublicKey = trustAnchorInputArray[1];

// var pk = Secp256k1PublicKey.fromHex(trustAnchorPublicKey);
// var verifyResult = context.verify(jill.signature, jill.inputPayload, pk);
// console.log("Verify result: " + verifyResult);
