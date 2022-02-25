'use strict'

const { InvalidTransaction } = require('sawtooth-sdk/processor/exceptions')

class TrustEntityPayload {
  constructor (receiver, trustedBy, action) {
    this.receiver = receiver;
    this.trustedBy = trustedBy;
    this.action = action;
  }

  static fromBytes (payload) {
    payload = Buffer.from(payload, 'base64').toString().split(',')
    if (payload.length === 3) {
      let trustEntityPayload = new TrustEntityPayload(payload[0], payload[1], payload[2])
      if (!trustEntityPayload.receiver) {
        throw new InvalidTransaction('Receiver is required')
      }

      if (!trustEntityPayload.trustedBy) {
        throw new InvalidTransaction('TrustedBy is required')
      }

      if (!trustEntityPayload.action) {
        throw new InvalidTransaction('Action is required')
      }
      return trustEntityPayload
    } else {
      throw new InvalidTransaction('Invalid trust entity payload serialization')
    }
  }
}

module.exports = {
  TrustEntityPayload
}
