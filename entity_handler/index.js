'use strict'

const { TransactionProcessor } = require('sawtooth-sdk/processor')
const EntityHandler = require('./handler')

let address = "tcp://localhost:4004";
if (process.argv.length < 3) {
  console.log('Warning: missing a validator address, setting default to "tcp://localhost:4004"');
} else {
  address = process.argv[2];
}

const transactionProcessor = new TransactionProcessor(address)

transactionProcessor.addHandler(new EntityHandler())

transactionProcessor.start()
