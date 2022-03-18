// From https://github.com/alejandrolr/sawtooth-app-js/blob/master/jsclient/routes/SimpleWalletClient.js

import { createHash } from 'crypto';
import { CryptoFactory, createContext, Signer } from 'sawtooth-sdk/signing';
import protobuf from 'sawtooth-sdk/protobuf';
import fs from 'fs';
import fetch from 'node-fetch';
import { Secp256k1PrivateKey } from 'sawtooth-sdk/signing/secp256k1';
// tslint:disable-next-line:no-var-requires
const {TextEncoder, TextDecoder} = require('text-encoding/lib/encoding')

import { TransactionPayload, TransactionAction, CreateActionParameters, AddTrustActionParameters } from 'entity_shared/types';

function hash(v:string):string {
    return createHash('sha512').update(v).digest('hex').toLowerCase();
}

function toBase64(str:string):string {
    return Buffer.from(str, 'utf8').toString('base64');
}

export class EntityClient {
    signer: Signer;
    publicKey: string;
    constructor() {
        const privateKeyStr = this.getPriKey().toString().trim();
        const context = createContext('secp256k1');
        const privateKey = Secp256k1PrivateKey.fromHex(privateKeyStr);
        this.signer = new CryptoFactory(context).newSigner(privateKey);
        this.publicKey = this.signer.getPublicKey().asHex();
      }

    create(transactionPayload:TransactionPayload) {
        const transactionAction = TransactionAction.fromBase64(transactionPayload.payload);
        const inputAddresses = [this.getAddress(transactionAction.signer), this.getAddress(transactionAction.affectedEntity)];
        const outputAddresses = [this.getAddress(transactionAction.affectedEntity)];
        return this._send_wrapped(transactionPayload.toBuffer().toString(), inputAddresses, outputAddresses);
    }

    addTrust(transactionPayload:TransactionPayload) {
        const transactionAction = TransactionAction.fromBase64(transactionPayload.payload);
        const inputAddresses = [this.getAddress(transactionAction.signer), this.getAddress(transactionAction.affectedEntity)];
        const outputAddresses = [this.getAddress(transactionAction.affectedEntity)];
        this._send_wrapped(transactionPayload.toBuffer().toString(), inputAddresses, outputAddresses);
    }

    createChildrenProperty(transactionPayload:TransactionPayload) {
        const transactionAction = TransactionAction.fromBase64(transactionPayload.payload);
        const inputAddresses = [this.getAddress(transactionAction.signer), this.getAddress(transactionAction.affectedEntity)];
        const outputAddresses = [this.getAddress(transactionAction.affectedEntity)];
        this._send_wrapped(transactionPayload.toBuffer().toString(), inputAddresses, outputAddresses);
    }

    useChildrenProperty(transactionPayload:TransactionPayload) {
        const transactionAction = TransactionAction.fromBase64(transactionPayload.payload);
        const inputAddresses = [this.getAddress(transactionAction.signer), this.getAddress(transactionAction.affectedEntity)];
        const outputAddresses = [this.getAddress(transactionAction.affectedEntity)];
        this._send_wrapped(transactionPayload.toBuffer().toString(), inputAddresses, outputAddresses);
    }

    getAddress(name:string) {
        return hash("entity").substr(0, 6) + hash(name).substr(0, 64);
    }

    getPriKey() {
        const privkeyfile = './keys/client.priv';
        return fs.readFileSync(privkeyfile);
    }

    getPubKey() {
        const pubkeyfile = './keys/client.pub';
        return fs.readFileSync(pubkeyfile);
    }

    _wrap_and_send(inputPayload:string, signature:string, ownerName:string, action:string, inputAddresses:string[], outputAddresses:string[]) {
        let payload = '';
        payload = [inputPayload, signature, ownerName, action].join(",");
        console.log(payload);
        this._send_wrapped(payload, inputAddresses, outputAddresses);
    }

    _send_wrapped(payload:string, inputAddresses:string[], outputAddresses:string[]){
        const enc = new TextEncoder('utf8');
        const payloadBytes = enc.encode(payload);
        const transactionHeaderBytes:any = protobuf.TransactionHeader.encode({
            familyName: 'entity',
            familyVersion: '1.0',
            inputs: inputAddresses,
            outputs: outputAddresses,
            signerPublicKey: this.signer.getPublicKey().asHex(),
            nonce: "" + Math.random(),
            batcherPublicKey: this.signer.getPublicKey().asHex(),
            dependencies: [],
            payloadSha512: hash(payloadBytes),
        }).finish();
        const transaction = protobuf.Transaction.create({
            header: transactionHeaderBytes,
            headerSignature: this.signer.sign(transactionHeaderBytes),
            payload: payloadBytes
        });
        const transactions = [transaction];
        const batchHeaderBytes:any = protobuf.BatchHeader.encode({
            signerPublicKey: this.signer.getPublicKey().asHex(),
            transactionIds: transactions.map((txn) => txn.headerSignature),
        }).finish();
        const batchSignature = this.signer.sign(batchHeaderBytes);
        const batch = protobuf.Batch.create({
            header: batchHeaderBytes,
            headerSignature: batchSignature,
            transactions,
        });
        const batchListBytes = protobuf.BatchList.encode({
            batches: [batch]
        }).finish();
        return this._send_to_rest_api(batchListBytes);
    }

    async _send_to_rest_api(batchListBytes:any){
        if (batchListBytes == null) {
            throw new Error('GET method not implemented.');
        }
        else {
            const response = await fetch('http://localhost:8008/batches', {
                method: 'POST',
                headers: {
                'Content-Type': 'application/octet-stream'
            },
                body: batchListBytes
            });
            return await response.json();
        }
    }
}