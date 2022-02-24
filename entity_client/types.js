class Entity {
    constructor (name, publicKey, ownerName, action) {
      this.name = name;
      this.publicKey = publicKey;
      this.ownerName = ownerName;
      this.action = action;
    }

    toBase64() {
        let entity = [this.name, this.publicKey, this.ownerName, this.action].join(',');
        return Buffer.from(entity, 'utf8').toString('base64');
    }

    static fromBase64(base64Str) {
        let array = Buffer.from(base64Str, 'base64').toString().split(',');
        return new Entity(array[0], array[1], array[2], array[3]);
    }
}

class EntityTransaction {
    constructor (inputPayload, signature, ownerName, action, name) {
      this.inputPayload = inputPayload;
      this.signature = signature;
      this.ownerName = ownerName;
      this.action = action;
      this.name = name;
    }
}

module.exports = {
    Entity,
    EntityTransaction
}