export class StateEntity {
    publicKey: string;
    name: string;
    owner: string;
    trustedBy: string[];
    properties: StateEntityProperty[];
    childrenProperties: string[];

    constructor (publicKey: string, name: string, owner: string, trustedBy: string[], properties: StateEntityProperty[], childrenProperties: string[]) {
        this.publicKey = publicKey;
        this.name = name;
        this.owner = owner;
        this.trustedBy = trustedBy;
        this.properties = properties;
        this.childrenProperties = childrenProperties;
    }

    static fromString(string: string): StateEntity {
        let splitData = string.split(',');
        let decodedTrustedBy = Buffer.from(splitData[3], 'base64').toString().split(',');
        let decodedProperties = StateEntityProperty.fromBase64(splitData[4]);
        let decodedChildrenProperties = Buffer.from(splitData[5], 'base64').toString().split(',');
        return new StateEntity(
            splitData[0],
            splitData[1],
            splitData[2],
            decodedTrustedBy,
            decodedProperties,
            decodedChildrenProperties
        );
    }

    toString(): Buffer {
        let encodedTrustedBy = Buffer.from(this.trustedBy.join(','), 'utf8').toString('base64');
        let encodedProperties = Buffer.from(this.properties.join(','), 'utf8').toString('base64');
        let encodedChildrenProperties = Buffer.from(this.childrenProperties.join(','), 'utf8').toString('base64');

        let array = [
            this.publicKey, 
            this.name, 
            this.owner, 
            encodedTrustedBy, 
            encodedProperties,
            encodedChildrenProperties
        ];

        return Buffer.from(array.join(','))
    }
}

export class StateEntityProperty {
    property: string;
    value: string;

    constructor (property: string, value: string) {
        this.property = property;
        this.value = value;
    }

    static fromBase64(string: string): StateEntityProperty[] {
        return Buffer.from(string, 'base64').toString().split(',').map(StateEntityProperty.fromPairString);
    }

    static fromPairString(string: string): StateEntityProperty {
        let splitData = string.split(":");
        return new StateEntityProperty(splitData[0], splitData[1]);
    }
}