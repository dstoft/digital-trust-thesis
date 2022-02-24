'use strict'

const EntityPayload = require('./entityPayload')
const EntityTransactionPayload = require('./entityTransactionPayload')

const { ENTITY_NAMESPACE, ENTITY_FAMILY, EntityState } = require('./state')

const { TransactionHandler } = require('sawtooth-sdk/processor/handler')
const { InvalidTransaction } = require('sawtooth-sdk/processor/exceptions')

const { createContext } = require('sawtooth-sdk/signing')
const {Secp256k1PrivateKey, Secp256k1PublicKey} = require('sawtooth-sdk/signing/secp256k1')	

const trustAnchorPublicKey = '03393b90993f7421a5092b2a9936009dd2bb22a70cc4ff89bf577884477dda5dff';

class EntityHandler extends TransactionHandler {
  constructor () {
    super(ENTITY_FAMILY, ['1.0'], [ENTITY_NAMESPACE])
    this.context = createContext('secp256k1');
  }

  apply (transactionProcessRequest, context) {
    let transactionPayload = EntityTransactionPayload.fromBytes(transactionProcessRequest.payload)
    let entityState = new EntityState(context)

    return entityState.getEntity(transactionPayload.ownerName).then((ownerEntity) => {
      if(!this._verifyTransactionSignature(ownerEntity, transactionPayload.inputPayload, transactionPayload.signature, transactionPayload.ownerName)) {
        throw new InvalidTransaction('Invalid signature!');
      }
    }).then(() => {

      let entityPayload = EntityPayload.fromBytes(transactionPayload.inputPayload);
      if (entityPayload.action === 'create') {
        return this._createEntity(entityPayload, entityState);
      } else {
        throw new InvalidTransaction(
          `Action must be create, not ${entityPayload.action}`
        )
      }
    });
  }

  _createEntity(entityPayload, entityState) {
    return entityState.getEntity(entityPayload.name)
    .then((entity) => {
      if (entity !== undefined && entity !== null) {
        throw new InvalidTransaction('Invalid Action: Entity already exists.')
      }
      
      let createdEntity = {
        publicKey: entityPayload.publicKey,
        name: entityPayload.name,
        trustedBy: [],
        owner: entityPayload.ownerName
      };

      return entityState.setEntity(entityPayload.name, createdEntity)
    });
  }

  _verifyTransactionSignature(ownerEntity, inputPayload, signature, ownerName) {
    if(ownerName == 'trust-anchor') {
      console.log('Verifying trust-anchor');
      return this._verifySignature(signature, inputPayload, trustAnchorPublicKey);
    }
    if(ownerEntity === null) {
      console.log('Owner entity is null');
      return false;
    }
    return this._verifySignature(signature, inputPayload, ownerEntity.publicKey);
  }

  _verifySignature(signature, message, publicKey) {
    return this.context.verify(signature, message, Secp256k1PublicKey.fromHex(publicKey));
  }
}

module.exports = EntityHandler
