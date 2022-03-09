export class TransactionPayload {
    payload: TransactionAction;
    signature: string;

    constructor(payload: TransactionAction, signature: string) {
        this.payload = payload;
        this.signature = signature;
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
        let encodedParameters = Buffer.from(this.parameters.toString(), 'utf8').toString('base64');

        let array = [
            this.signer, 
            this.action, 
            this.affectedEntity,
            encodedParameters
        ];

        return Buffer.from(array.join(','));
    }
}

class ActionParameters {

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
}

export class AddTrustActionParameters extends ActionParameters {
    trustedBy: string;

    constructor(trustedBy: string) {
        super();
        this.trustedBy = trustedBy;
    }

    toBuffer(): Buffer {
        let array = [
            this.trustedBy
        ];

        return Buffer.from(array.join(','));
    }
}