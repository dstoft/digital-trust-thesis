# Knowledge
This is a knowledge base for what

## States not being set
Exception from the docker logs of the single-node sawtooth:
```
sawtooth-validator-default | [2022-02-23 10:37:18.797 DEBUG    ffi] [src/journal/block_scheduler.rs: 166] Adding block d2b17f0514475e85d5afdbcbef89c26e1695bc5d60d58f52f90de87e260e8436737f0342c79f9bf0f2d2b2dbc446e8901df08ab3fedbf62549bc11af73d6bc56 for processing
sawtooth-validator-default | [2022-02-23 10:37:18.810 WARNING  (unknown file)] [src/journal/block_validator.rs: 272] Block d2b17f0514475e85d5afdbcbef89c26e1695bc5d60d58f52f90de87e260e8436737f0342c79f9bf0f2d2b2dbc446e8901df08ab3fedbf62549bc11af73d6bc56 failed validation: Block d2b17f0514475e85d5afdbcbef89c26e1695bc5d60d58f52f90de87e260e8436737f0342c79f9bf0f2d2b2dbc446e8901df08ab3fedbf62549bc11af73d6bc56 failed validation: expected state hash 26c6e72a21add266c6f8e6a96e810814bdb2101d9aba62939d5317ad6a9d0e34, validation found state hash 78ba9ee957ea92ac36cba87b9b1a09ac3c26aad917a8592afc8d611944ff90a6
sawtooth-validator-default | [2022-02-23 10:37:18.824 WARNING  context_manager] Context_id not in contexts, 6dc79ff18b1b4e35ae737fd976d20de7
sawtooth-validator-default | [2022-02-23 10:37:18.824 DEBUG    tp_state_handlers] SET: No Values Set
```

Resolution:
- Remember to have the "apply" function return something. Don't know why that resolves it.



# AuthorizationException: Tried to get unauthorized address X

When fetching data in the transaction processor from the state, the addresses will be "unauthorized", if the addresses are not added to the inputs/outputs of the transaction header in the client.

Resolution: Add necessary addresses to fetch state data from to inputs in the transaction header.

Source: https://stackoverflow.com/questions/60812212/hyperledger-sawtooth-submit-transaction-error-tried-to-get-unauthorized-address
Source: https://sawtooth.hyperledger.org/docs/1.2/app_developers_guide/python_sdk.html#1-create-the-transaction-header 