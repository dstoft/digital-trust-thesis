import { ActionParameters } from "./ActionParameters";


export class CreateChildrenPropertyActionParameters extends ActionParameters {
    propertyName: string;

    constructor(propertyName: string) {
        super();
        this.propertyName = propertyName;
    }

    toBuffer(): Buffer {
        const array = [
            this.propertyName
        ];

        return Buffer.from(array.join(','));
    }

    static fromBase64(string: string) {
        const splitData = Buffer.from(string, 'base64').toString().split(',');
        return new CreateChildrenPropertyActionParameters(splitData[0]);
    }
}
