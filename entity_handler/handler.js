/**
 * Copyright 2017-2018 Intel Corporation
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ------------------------------------------------------------------------------
 */

'use strict'

const EntityPayload = require('./entityPayload')
const EntityTransactionPayload = require('./entityTransactionPayload')

const { ENTITY_NAMESPACE, ENTITY_FAMILY, EntityState } = require('./state')

const { TransactionHandler } = require('sawtooth-sdk/processor/handler')
const { InvalidTransaction } = require('sawtooth-sdk/processor/exceptions')

const trustAnchorPublicKey = 'wow';

class EntityHandler extends TransactionHandler {
  constructor () {
    super(ENTITY_FAMILY, ['1.0'], [ENTITY_NAMESPACE])
  }

  apply (transactionProcessRequest, context) {
    let transactionPayload = EntityTransactionPayload.fromBytes(transactionProcessRequest.payload)
    let entityState = new EntityState(context)
    // let header = transactionProcessRequest.header
    // let player = header.signerPublicKey

    let owner = entityState.getEntity(transactionPayload.ownerName);
    // Verify signature (dump if-statement for now)
    if(!this._verifySignature(transactionPayload.ownerName, transactionPayload.inputPayload, transactionPayload.signature)) {
      throw new InvalidTransaction('Invalid signature!');
    }

    let entityPayload = EntityPayload.fromBytes(transactionPayload.inputPayload);
    if (entityPayload.action === 'create') {
      return entityState.getEntity(entityPayload.name)
        .then((entity) => {
          if (entity !== undefined) {
            throw new InvalidTransaction('Invalid Action: Entity already exists.')
          }
          
          let createdEntity = {
            publicKey: entityPayload.publicKey,
            name: entityPayload.name,
            trustedBy: [],
            owner: entityPayload.ownerName
          };

          console.log('Setting entity');
          return entityState.setEntity(entityPayload.name, createdEntity)
        })
    } else {
      throw new InvalidTransaction(
        `Action must be create, not ${entityPayload.action}`
      )
    }
  }

  _verifySignature(ownerName, inputPayload, signature) {
    if(ownerName == 'trust-anchor' && signature == trustAnchorPublicKey) {
      console.log('Verifying trust-anchor');
      return true;
    }
    let ownerEntity = entityState.getEntity(ownerName);
    if(ownerEntity === null) {
      console.log('Owner entity is null');
      return false;
    }
    if(transactionPayload.signature == owner.publicKey) {
      console.log('Signature verified');
      return true;
    }
    console.log('Could not verify signature')
    return false;
  }
}

module.exports = EntityHandler
