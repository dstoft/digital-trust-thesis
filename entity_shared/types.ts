export class TransactionPayload {
    payload: string;
    signature: string;

    constructor(payload: string, signature: string) {
        this.payload = payload;
        this.signature = signature;
    }

    toBuffer(): Buffer {
        let array = [
            this.payload,
            this.signature
        ];

        return Buffer.from(array.join(','));
    }

    static fromBytes (payload: any) {
        var splitData = payload.toString().split(',')
        return new TransactionPayload(splitData[0], splitData[1]);
    }
}

export class TransactionAction {
    signer: string;
    action: string;
    affectedEntity: string;
    parameters: ActionParameters;

    constructor(signer: string, action: string, affectedEntity: string, parameters: ActionParameters) {
        this.signer = signer;
        this.action = action;
        this.affectedEntity = affectedEntity;
        this.parameters = parameters;
    }

    toBuffer(): Buffer {
        let encodedParameters = Buffer.from(this.parameters.toBuffer().toString(), 'utf8').toString('base64');

        let array = [
            this.signer, 
            this.action, 
            this.affectedEntity,
            encodedParameters
        ];

        return Buffer.from(array.join(','));
    }

    toBase64(): string {
        return this.toBuffer().toString("base64");
    }

    static fromBase64(string: string): TransactionAction {
        var splitData = Buffer.from(string, 'base64').toString().split(',');
        return new TransactionAction(splitData[0], splitData[1], splitData[2], ActionParameters.fromBase64(splitData[3], splitData[1]));
    }
}

abstract class ActionParameters {

    static fromBase64(string: string, action: string) {
        if(action === "create") {
            return CreateActionParameters.fromBase64(string);
        } else if(action === "add-trust") {
            return AddTrustActionParameters.fromBase64(string);
        } else if(action === "create-children-property") {
            return CreateChildrenPropertyActionParameters.fromBase64(string);
        } else if(action === "use-children-property") {
            return UseChildrenPropertyActionParameters.fromBase64(string);
        } else {
            throw new RangeError("ActionParameters does not recognize the provided action!");
        }
    }

    abstract toBuffer(): Buffer;
}

export class CreateActionParameters extends ActionParameters {
    publicKey: string;

    constructor(publicKey: string) {
        super();
        this.publicKey = publicKey;
    }

    toBuffer(): Buffer {
        let array = [
            this.publicKey
        ];

        return Buffer.from(array.join(','));
    }

    static fromBase64(string: string) {
        var splitData = Buffer.from(string, 'base64').toString().split(',');
        return new CreateActionParameters(splitData[0]);
    }
}

export class AddTrustActionParameters extends ActionParameters {
    constructor() {
        super();
    }

    toBuffer(): Buffer {
        let array = [
        ];

        return Buffer.from(array.join(','));
    }

    static fromBase64(string: string) {
        var splitData = Buffer.from(string, 'base64').toString().split(',');
        return new AddTrustActionParameters();
    }
}

export class CreateChildrenPropertyActionParameters extends ActionParameters {
    propertyName: string;

    constructor(propertyName: string) {
        super();
        this.propertyName = propertyName;
    }

    toBuffer(): Buffer {
        let array = [
            this.propertyName
        ];

        return Buffer.from(array.join(','));
    }

    static fromBase64(string: string) {
        var splitData = Buffer.from(string, 'base64').toString().split(',');
        return new CreateChildrenPropertyActionParameters(splitData[0]);
    }
}

export class UseChildrenPropertyActionParameters extends ActionParameters {
    propertyName: string;
    propertyValue: string;

    constructor(propertyName: string, propertyValue: string) {
        super();
        this.propertyName = propertyName;
        this.propertyValue = propertyValue;
    }

    toBuffer(): Buffer {
        let array = [
            this.propertyName,
            this.propertyValue
        ];

        return Buffer.from(array.join(','));
    }

    static fromBase64(string: string) {
        var splitData = Buffer.from(string, 'base64').toString().split(',');
        return new UseChildrenPropertyActionParameters(splitData[0], splitData[1]);
    }
}