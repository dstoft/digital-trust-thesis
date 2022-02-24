// From https://github.com/alejandrolr/sawtooth-app-js/blob/master/jsclient/routes/SimpleWalletClient.js

const {createHash} = require('crypto')
const {CryptoFactory, createContext } = require('sawtooth-sdk/signing')
const protobuf = require('sawtooth-sdk/protobuf')
const fs = require('fs')
const fetch = require('node-fetch');
const {Secp256k1PrivateKey} = require('sawtooth-sdk/signing/secp256k1')	
const {TextEncoder, TextDecoder} = require('text-encoding/lib/encoding')

function hash(v) {
    return createHash('sha512').update(v).digest('hex').toLowerCase();
}

function toBase64(str) {
    return Buffer.from(str, 'utf8').toString('base64');
}

class XOClient {
    constructor(userid) {
        const privateKeyStrBuf = this.getUserPriKey(userid);
        console.log(privateKeyStrBuf.toString());
        const privateKeyStr = privateKeyStrBuf.toString().trim();
        const context = createContext('secp256k1');
        const privateKey = Secp256k1PrivateKey.fromHex(privateKeyStr);
        this.signer = new CryptoFactory(context).newSigner(privateKey);
        this.publicKey = this.signer.getPublicKey().asHex();
      }

    create(inputPayload, signature, ownerName, name) {
        let inputAddresses = [this.getAddress(ownerName), this.getAddress(name)];
        let outputAddresses = [this.getAddress(name)];
        this._wrap_and_send(inputPayload, signature, ownerName, 'create', inputAddresses, outputAddresses);
    }

    getAddress(name) {
        return hash("entity").substr(0, 6) + hash(name).substr(0, 64);
    }

    getUserPriKey(userid) {
        console.log(userid);
        console.log("Current working directory is: " + process.cwd());
        var userprivkeyfile = './keys/'+userid+'.priv';
        return fs.readFileSync(userprivkeyfile);
    }

    getUserPubKey(userid) {
        console.log(userid);
        console.log("Current working directory is: " + process.cwd());
        var userpubkeyfile = './keys/'+userid+'.pub';
        return fs.readFileSync(userpubkeyfile);
    }

    _wrap_and_send(inputPayload, signature, ownerName, action, inputAddresses, outputAddresses) {
        var payload = '';
        payload = [inputPayload, signature, ownerName, action].join(",");
        console.log(payload);
        this._send_wrapped(payload, inputAddresses, outputAddresses);
    }

    _send_wrapped(payload, inputAddresses, outputAddresses){
        var enc = new TextEncoder('utf8');
        const payloadBytes = enc.encode(payload);
        const transactionHeaderBytes = protobuf.TransactionHeader.encode({
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
        const batchHeaderBytes = protobuf.BatchHeader.encode({
            signerPublicKey: this.signer.getPublicKey().asHex(),
            transactionIds: transactions.map((txn) => txn.headerSignature),
        }).finish();
        const batchSignature = this.signer.sign(batchHeaderBytes);
        const batch = protobuf.Batch.create({
            header: batchHeaderBytes,
            headerSignature: batchSignature,
            transactions: transactions,
        });
        const batchListBytes = protobuf.BatchList.encode({
            batches: [batch]
        }).finish();
        this._send_to_rest_api(batchListBytes);	
    }
  
    _send_to_rest_api(batchListBytes){
        if (batchListBytes == null) {
            var geturl = 'http://localhost:8008/state/'+this.address
            console.log("Getting from: " + geturl);
            return fetch(geturl, {
                method: 'GET',
            })
            .then((response) => response.json())
            .then((responseJson) => {
                var data = responseJson.data;
                var amount = new Buffer(data, 'base64').toString();
                return amount;
            })
            .catch((error) => {
                console.error(error);
            }); 	
        }
        else{
            fetch('http://localhost:8008/batches', {
                method: 'POST',
                headers: {
                'Content-Type': 'application/octet-stream'
            },
                body: batchListBytes
            })
            .then((response) => response.json())
            .then((responseJson) => {
                console.log(responseJson);
            })
            .catch((error) => {
                console.error(error);
            }); 	
        }
    }
}
module.exports.XOClient = XOClient;