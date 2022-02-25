'use strict'

const EntityTransactionPayload = require('./entityTransactionPayload')
const EntityPayload = require('./entityPayload')
const { TrustEntityPayload } = require('./trustEntityPayload')

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

      if (transactionPayload.action === 'create') {
        let entityPayload = EntityPayload.fromBytes(transactionPayload.inputPayload);
        this._verifyActionConsistency(transactionPayload.action, entityPayload.action);
        return this._createEntity(entityPayload, entityState);
      } else if (transactionPayload.action === 'add-trust') {
        let payload = TrustEntityPayload.fromBytes(transactionPayload.inputPayload);
        this._verifyActionConsistency(transactionPayload.action, payload.action);
        return this._addTrustRelationship(payload, entityState);
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

  _addTrustRelationship(trustEntityPayload, entityState) {
    return entityState.addTrustedBy(trustEntityPayload.receiver, trustEntityPayload.trustedBy);
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

  _verifyActionConsistency(action, otherAction) {
    if(action == otherAction) {
      return;
    }
    throw new InvalidTransaction('Actions from the two payloads does not match!');
  }
}

module.exports = EntityHandler
