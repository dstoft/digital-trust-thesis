import { CreateActionParameters, TransactionAction, TransactionPayload } from "entity_shared/types";
import { CreateEntityParameters } from "./parameters/createEntityParameters";
import { createContext } from 'sawtooth-sdk/signing';
import { Secp256k1PrivateKey } from 'sawtooth-sdk/signing/secp256k1';
import { EntityClient } from "../infrastructure/client/entityClient";

export class EntityService {

    createEntity(parameters: CreateEntityParameters) {
        const actionParameters = new CreateActionParameters(parameters.publicKey);
        const action = new TransactionAction(parameters.signer, "create", parameters.affectedEntity, actionParameters);
        const transactionPayload = this.signTransaction(action, parameters.privateKey);

        const client = new EntityClient();
        return client.applyTransactionPayload(transactionPayload);
    }

    private signTransaction(action: TransactionAction, privateKeyStr: string): TransactionPayload {
        const privateKey = Secp256k1PrivateKey.fromHex(privateKeyStr.trim());
        const context = createContext('secp256k1');

        const encodedAction = action.toBuffer().toString("base64");
        const signature = context.sign(Buffer.from(encodedAction), privateKey);
        const transactionPayload = new TransactionPayload(encodedAction, signature);
        return transactionPayload;
    }
}