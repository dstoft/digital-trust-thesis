export class TransactionPayload {
    payload: string;
    signature: string;

    constructor(payload: string, signature: string) {
        this.payload = payload;
        this.signature = signature;
    }

    toBuffer(): Buffer {
        const array = [
            this.payload,
            this.signature
        ];

        return Buffer.from(array.join(','));
    }

    static fromBytes(payload: any) {
        const splitData = payload.toString().split(',');
        return new TransactionPayload(splitData[0], splitData[1]);
    }
}
