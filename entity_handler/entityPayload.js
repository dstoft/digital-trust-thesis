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

class EntityPayload {
  constructor (name, publicKey, ownerName, action) {
    this.name = name;
    this.publicKey = publicKey;
    this.ownerName = ownerName;
    this.action = action;
  }

  static fromBytes (payload) {
    payload = Buffer.from(payload, 'base64').toString().split(',')
    if (payload.length === 4) {
      let entityPayload = new EntityPayload(payload[0], payload[1], payload[2], payload[3])
      if (!entityPayload.name) {
        throw new InvalidTransaction('Name is required')
      }
      if (entityPayload.name.indexOf('|') !== -1) {
        throw new InvalidTransaction('Name cannot contain "|"')
      }

      if (!entityPayload.publicKey) {
        throw new InvalidTransaction('Public key is required')
      }

      if (!entityPayload.ownerName) {
        throw new InvalidTransaction('Owner name is required')
      }
      if (entityPayload.ownerName.indexOf('|') !== -1) {
        throw new InvalidTransaction('Owner name cannot contain "|"')
      }

      if (!entityPayload.action) {
        throw new InvalidTransaction('Action is required')
      }
      return entityPayload
    } else {
      throw new InvalidTransaction('Invalid entity payload serialization')
    }
  }
}

module.exports = EntityPayload
