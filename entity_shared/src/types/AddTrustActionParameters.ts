import { ActionParameters } from "./ActionParameters";


export class AddTrustActionParameters extends ActionParameters {
    constructor() {
        super();
    }

    toBuffer(): Buffer {
        const array: string[] = [];

        return Buffer.from(array.join(','));
    }

    static fromBase64(string: string) {
        const splitData = Buffer.from(string, 'base64').toString().split(',');
        return new AddTrustActionParameters();
    }
}
