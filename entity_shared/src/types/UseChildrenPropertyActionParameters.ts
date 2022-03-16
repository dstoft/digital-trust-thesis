import { ActionParameters } from "./ActionParameters";


export class UseChildrenPropertyActionParameters extends ActionParameters {
    propertyName: string;
    propertyValue: string;

    constructor(propertyName: string, propertyValue: string) {
        super();
        this.propertyName = propertyName;
        this.propertyValue = propertyValue;
    }

    toBuffer(): Buffer {
        const array = [
            this.propertyName,
            this.propertyValue
        ];

        return Buffer.from(array.join(','));
    }

    static fromBase64(string: string) {
        const splitData = Buffer.from(string, 'base64').toString().split(',');
        return new UseChildrenPropertyActionParameters(splitData[0], splitData[1]);
    }
}
