'use strict'

import { EntityClient } from './client';
const client = new EntityClient();

import { createNewKeyPair } from "./keys/creator";

import { CryptoFactory, createContext } from 'sawtooth-sdk/signing';
import { Secp256k1PrivateKey, Secp256k1PublicKey } from 'sawtooth-sdk/signing/secp256k1';
const context = createContext('secp256k1');

import { createTrustAnchor, createJohn, createJill, addTrustEnergistyrelsenToJohn, addTrustJohnToJill, addTrustEnergistyrelsenToJill, createChildrenPropertyForEntity, useChildrenPropertyForEntity } from './submitter';

// tslint:disable-next-line:no-console
// console.log(createTrustAnchor());

import { setup } from './controller';
setup();

// client.create(createTrustAnchor());
// client.create(createJohn());
// client.create(createJill());

// client.addTrust(addTrustEnergistyrelsenToJohn());
// client.addTrust(addTrustJohnToJill());
// client.addTrust(addTrustEnergistyrelsenToJill());

// client.createChildrenProperty(createChildrenPropertyForEntity("Energistyrelsen","installer"));
// client.createChildrenProperty(createChildrenPropertyForEntity("Energistyrelsen","types"));

// client.useChildrenProperty(useChildrenPropertyForEntity("john", "Energistyrelsen", "installer", "yes"));
// client.useChildrenProperty(useChildrenPropertyForEntity("john", "Energistyrelsen", "installer", "no"));
// client.useChildrenProperty(useChildrenPropertyForEntity("john", "Energistyrelsen", "types", "potato;salad;carrots;pineapples"));


// How to verify signature here on the client side
// let trustAnchorInputArray = Buffer.from(trustAnchor.inputPayload, 'base64').toString().split(',');
// var trustAnchorPublicKey = trustAnchorInputArray[1];

// var pk = Secp256k1PublicKey.fromHex(trustAnchorPublicKey);
// var verifyResult = context.verify(jill.signature, jill.inputPayload, pk);
// console.log("Verify result: " + verifyResult);
