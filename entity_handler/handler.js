'use strict'

const { ENTITY_NAMESPACE, ENTITY_FAMILY, EntityState } = require('./state')

const { TransactionHandler } = require('sawtooth-sdk/processor/handler')
const { InvalidTransaction } = require('sawtooth-sdk/processor/exceptions')

const { createContext } = require('sawtooth-sdk/signing')
const {Secp256k1PrivateKey, Secp256k1PublicKey} = require('sawtooth-sdk/signing/secp256k1')	
const StateEntity = require('./dist/types').StateEntity;
const StateEntityProperty = require('./dist/types').StateEntityProperty;
const {TransactionPayload, TransactionAction} = require('entity_shared/types');

const trustAnchorPublicKey = '03393b90993f7421a5092b2a9936009dd2bb22a70cc4ff89bf577884477dda5dff';

const reservedEntityNames = ["trust-anchor", "locked"];

class EntityHandler extends TransactionHandler {
  constructor () {
    super(ENTITY_FAMILY, ['1.0'], [ENTITY_NAMESPACE])
    this.context = createContext('secp256k1');
  }

  apply (transactionProcessRequest, context) {
    let transactionPayload = TransactionPayload.fromBytes(transactionProcessRequest.payload);
    let transactionAction = TransactionAction.fromBase64(transactionPayload.payload);
    let entityState = new EntityState(context);

    return entityState.getEntity(transactionAction.signer).then((ownerEntity) => {
      if(!this._verifyTransactionSignature(ownerEntity, transactionPayload.payload, transactionPayload.signature, transactionAction.signer)) {
        throw new InvalidTransaction('Invalid signature!');
      }
    }).then(() => {
      if(transactionAction.action === "use-children-property" || transactionAction.action === "lock-entity") {
        return this._verifyParenthood(transactionAction.affectedEntity, transactionAction.signer, entityState);
      }
    }).then(() => {

      if (transactionAction.action === 'create') {
        return this._createEntity(transactionAction.affectedEntity, transactionAction.parameters.publicKey, transactionAction.signer, entityState);
      } else if (transactionAction.action === 'add-trust') {
        return this._addTrustRelationship(transactionAction.affectedEntity, transactionAction.signer, entityState);
      } else if (transactionAction.action === 'create-children-property') {
        if(transactionAction.affectedEntity !== transactionAction.signer) {
          throw new InvalidTransaction("When creating children properties, the signer and affected entity must be the same!");
        }
        return this._createChildrenProperty(transactionAction.affectedEntity, transactionAction.parameters.propertyName, entityState);
      } else if (transactionAction.action === 'use-children-property') {
        return this._useChildrenProperty(transactionAction.affectedEntity, transactionAction.signer, transactionAction.parameters.propertyName, transactionAction.parameters.propertyValue, entityState);
      } else if (transactionAction.action === 'lock-entity') {
        return this._lockEntity(transactionAction.affectedEntity, entityState);
      } else {
        throw new InvalidTransaction(
          `Action must be create, not ${transactionAction.action}`
        )
      }
    });
  }

  _createEntity(affectedEntity, publicKey, owner, entityState) {
    if(reservedEntityNames.includes(affectedEntity)) {
      throw new InvalidTransaction('Invalid Action: Entity name ' + affectedEntity + ' is reserved!');
    }
    return entityState.getEntity(affectedEntity)
    .then((entity) => {
      if (entity !== undefined && entity !== null) {
        throw new InvalidTransaction('Invalid Action: Entity already exists.')
      }

      let createdEntity = new StateEntity(publicKey, affectedEntity, owner, [], [], []);

      return entityState.setEntity(affectedEntity, createdEntity)
    });
  }

  _addTrustRelationship(affectedEntity, trustByAddition, entityState) {
    return entityState.addTrustedBy(affectedEntity, trustByAddition);
  }

  _createChildrenProperty(affectedEntity, propertyName, entityState) {
    return entityState.createChildrenProperty(affectedEntity, propertyName);
  }

  _useChildrenProperty(affectedEntity, owner, propertyName, propertyValue, entityState) {
    return entityState.getEntity(owner)
    .then(entity => {
      let found = entity.childrenProperties.find(element => element == propertyName);
      if(found === undefined) { throw new InvalidTransaction('Owner does not have that children property!'); }

      var newStateEntityProperty = new StateEntityProperty(propertyName, propertyValue);
      return entityState.useChildrenProperty(affectedEntity, newStateEntityProperty);
    })
  }

  _lockEntity(affectedEntity, entityState) {
    return entityState.lockEntity(affectedEntity);
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

  _verifyParenthood(affectedEntityName, ownerName, entityState) {
    return entityState.getEntity(affectedEntityName).then((affectedEntity) => {
      if(affectedEntity.owner !== ownerName) {
        throw new InvalidTransaction('Invalid parenthood!');
      }
    })
  }
}

module.exports = EntityHandler
