import { StateClient } from '../infrastructure/client/stateClient';

const stopChainEntityNames = ["trust-anchor"];

export class TrustChainService {
    async getFrom(entityName:string, trustChain:Map<string, string[]>):Promise<Map<string, string[]>> {
        if(trustChain.has(entityName)) {
            return trustChain;
        }

        const stateClient = new StateClient();
        const currentStateEntity = await stateClient.getEntity(entityName);

        trustChain.set(currentStateEntity.name, currentStateEntity.trustedBy);

        if(stopChainEntityNames.includes(currentStateEntity.owner)) {
            return trustChain;
        }

        const currentTrustedBy = currentStateEntity.trustedBy.filter((trustedBy) => !trustChain.has(trustedBy));
        for (const trustedBy of currentTrustedBy) {
            trustChain = await this.getFrom(trustedBy, trustChain);
        }

        return trustChain;
    }
}