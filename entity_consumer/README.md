# Entity Consumer
This REST API consumes basic information (name, property names, etc.) and create entities on the blockchain. This consumer then handles the signing, etc., and it is an example of how "external" services can be used to communicate with the blockchain.
The only thing I do not like is communicating private keys to a REST API, however, this REST API is only intended to run inside the organization. And, if the organizations wants to implement other ways of signing the transactions, then hopefully this can serve as a example of how to sign it.

## Example requests
Example requests can be found by running the Postman queries found at https://www.getpostman.com/collections/85986978a967088de563.