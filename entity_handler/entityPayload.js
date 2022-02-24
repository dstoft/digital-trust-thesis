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
