# State design
The state will be considered a string-string key-value store. Meaning keys of strings references another string.
The encoding of the data will be raw with some base64 encoding for nested information.

## Addressing
The addresses use a six character prefix and then the name of what ever the address state contains.

https://sawtooth.hyperledger.org/docs/1.2/app_developers_guide/address_and_namespace.html

## State "entity"
The state will contain entities. Each entity will have it's own address.
The entity will have the following information:
- Public key, to verify future messages made by this entity
- Name
- Owner, the creator of the entity
- TrustedBy, a list of other entities that have stated that they trust this entity, base64 encoded
- Properties, a list of values of properties defined by the owner entity, base64 encoded
- ChildProperties, the list that children entities can for properties, base64 encoded