# Transaction processor raised exceptions
The exceptions raised by the processor (either from the processor itself or the validator) will keep on retrying the failed transaction until another transaction is succesfully processed. 

Sources:
https://sawtooth.hyperledger.org/faq/validator.html#after-a-failed-transaction
https://stackoverflow.com/questions/68831809/return-custom-error-on-hyperledger-sawtooth-transaction-processor 