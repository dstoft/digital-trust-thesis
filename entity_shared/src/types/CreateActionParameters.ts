import { ActionParameters } from "./ActionParameters";


export class CreateActionParameters extends ActionParameters {
    publicKey: string;

    constructor(publicKey: string) {
        super();
        this.publicKey = publicKey;
    }

    toBuffer(): Buffer {
        const array = [
            this.publicKey
        ];

        return Buffer.from(array.join(','));
    }

    static fromBase64(string: string) {
        const splitData = Buffer.from(string, 'base64').toString().split(',');
        return new CreateActionParameters(splitData[0]);
    }
}
