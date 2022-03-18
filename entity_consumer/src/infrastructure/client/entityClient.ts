import { TransactionPayload } from "entity_shared/types";
import fetch from 'node-fetch';

export class EntityClient {
    async applyTransactionPayload(transactionPayload: TransactionPayload) {
        const response = await fetch('http://localhost:8081', {
            method: 'post',
            body: JSON.stringify(transactionPayload),
            headers: {'Content-Type': 'application/json'}
        });
        return await response.json();
    }
}