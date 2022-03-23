import { createHash } from 'crypto';
import fetch from 'node-fetch';
import { StateEntity } from "entity_shared/stateTypes";

export class StateClient {

    async getEntity(entityName:string): Promise<StateEntity> {
        const address = this.getAddress(entityName);
        const response = await fetch('http://localhost:8008/state/' + address);
        return response.json().then((json) => {
            return StateEntity.fromBase64(json.data);
        });
    }

    private hash(v:string):string {
        return createHash('sha512').update(v).digest('hex').toLowerCase();
    }

    private getAddress(entityName:string) {
        return this.hash("entity").substring(0, 6) + this.hash(entityName).substring(0, 64);
    }
}