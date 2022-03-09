# Youtube tutorial by Dan Ostrom
https://www.youtube.com/watch?v=4VUaZkwJdCc

Only new knowledge is noted down here, so more knowledge may be available in the tutorial.

## The transaction processor
State is present on the validator, not on the transaction processor. Confirming my idea that the state is shared across the blockchain.
![](figures\transaction_process_with_validator.PNG) 

## The client
Primary job is to package and sign transactions & batches
A client can get state, such that it can fetch information present on the blockchain.
Batches allows for grouping of transactions, and trigger then atomically, such that either all or none execute.

## SDKs
There is no difference between the SDKs, all of them are simple reimplementations of how to use the Sawtooth API.

## The remainder of the video
Dan showed how to run the SimpleWallet application, which provided no further knowledge.
However, this repository may come in handy later in the process: https://github.com/hyperledger/education-sawtooth-simple-supply