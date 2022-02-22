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

const crypto = require('crypto')
const {TextEncoder, TextDecoder} = require('text-encoding/lib/encoding')

class EntityState {
  constructor (context) {
    this.context = context
    // this.addressCache = new Map([]) // No cache as of now
    this.timeout = 500 // Timeout in milliseconds
  }

  getEntity (name) {
    return Promise.resolve(undefined); // TODO: Remove this
    return this._loadEntity(name)
  }

  setEntity (name, entity) {
    let address = _makeEntityAddress(name)

    let data = _serialize(entity.publicKey, entity.name, entity.trustedBy, entity.owner);
    let entries = {
      [address]: data
    }
    console.log('Attempting to se context!');
    return this.context.setState(entries, this.timeout)
  }

  _loadEntity (name) {
    let address = _makeEntityAddress(name)
    return this.context.getState([address], this.timeout)
      .then((addressValues) => {
        if (!addressValues[address].toString()) {
          return null;
        } else {
          let data = addressValues[address].toString()
          return _deserialize(data);
        }
      }, reason => {
        return null;
      }
    );
  }
}

const _hash = (x) =>
  crypto.createHash('sha512').update(x).digest('hex').toLowerCase().substring(0, 64)

const ENTITY_FAMILY = 'entity'

const ENTITY_NAMESPACE = _hash(ENTITY_FAMILY).substring(0, 6)

const _makeEntityAddress = (x) => ENTITY_NAMESPACE + _hash(x)

module.exports = {
  ENTITY_NAMESPACE,
  ENTITY_FAMILY,
  EntityState
}

const _deserialize = (data) => {
  let splitData = data.split(',');
  return {
    publicKey: splitData[0],
    name: splitData[1],
    trustedBy: Buffer.from(splitData[2], 'base64').toString().split(','),
    owner: splitData[3]
  };
}

const _serialize = (publicKey, name, trustedBy, owner) => {
  let encodedTrustedBy = Buffer.from(trustedBy.join(','), 'utf8').toString('base64');
  let array = [publicKey, name, encodedTrustedBy, owner];

  return Buffer.from(array.join(','))
}
