/**
 * Copyright 2018 Intel Corporation
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

const { InvalidTransaction } = require('sawtooth-sdk/processor/exceptions')

class EntityTransactionPayload {
  constructor (inputPayload, signature, ownerName, action) {
    this.inputPayload = inputPayload;
    this.signature = signature;
    this.ownerName = ownerName;
    this.action = action;
  }

  static fromBytes (payload) {
    console.log('Transaction payload: ' + payload.toString())
    payload = payload.toString().split(',')
    if (payload.length === 4) {
      let entityTransactionPayload = new EntityTransactionPayload(payload[0], payload[1], payload[2], payload[3])
      if (!entityTransactionPayload.inputPayload) {
        throw new InvalidTransaction('Input payload is required')
      }

      if (!entityTransactionPayload.signature) {
        throw new InvalidTransaction('Signature is required')
      }

      if (!entityTransactionPayload.ownerName) {
        throw new InvalidTransaction('Owner name is required')
      }
      if (entityTransactionPayload.ownerName.indexOf('|') !== -1) {
        throw new InvalidTransaction('Owner name cannot contain "|"')
      }

      if (!entityTransactionPayload.action) {
        throw new InvalidTransaction('Action is required')
      }
      return entityTransactionPayload
    } else {
      throw new InvalidTransaction('Invalid entity transaction payload serialization')
    }
  }
}

module.exports = EntityTransactionPayload
