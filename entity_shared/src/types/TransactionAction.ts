import { ActionParameters } from "./ActionParameters";


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
        const encodedParameters = Buffer.from(this.parameters.toBuffer().toString(), 'utf8').toString('base64');

        const array = [
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
        const splitData = Buffer.from(string, 'base64').toString().split(',');
        return new TransactionAction(splitData[0], splitData[1], splitData[2], ActionParameters.fromBase64(splitData[3], splitData[1]));
    }
}
