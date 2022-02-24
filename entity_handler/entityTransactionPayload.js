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
