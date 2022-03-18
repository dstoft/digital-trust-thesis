import { AddTrustActionParameters, CreateActionParameters, CreateChildrenPropertyActionParameters, TransactionAction, TransactionPayload, UseChildrenPropertyActionParameters } from "entity_shared/types";
import { CreateEntityParameters } from "./parameters/createEntityParameters";
import { createContext } from 'sawtooth-sdk/signing';
import { Secp256k1PrivateKey } from 'sawtooth-sdk/signing/secp256k1';
import { EntityClient } from "../infrastructure/client/entityClient";
import { AddTrustParameters } from "./parameters/addTrustParameters";
import { CreateChildrenPropertyParameters } from "./parameters/CreateChildrenPropertyParameters";
import { UseChildrenPropertyParameters } from "./parameters/useChildrenPropertyParameters";

export class EntityService {

    createEntity(parameters: CreateEntityParameters): Promise<any> {
        const actionParameters = new CreateActionParameters(parameters.publicKey);
        const action = new TransactionAction(parameters.signer, "create", parameters.affectedEntity, actionParameters);
        const transactionPayload = this.signTransaction(action, parameters.privateKey);

        const client = new EntityClient();
        return client.applyTransactionPayload(transactionPayload);
    }

    addTrust(parameters: AddTrustParameters): Promise<any> {
        const actionParameters = new AddTrustActionParameters();
        const action = new TransactionAction(parameters.signer, "add-trust", parameters.affectedEntity, actionParameters);
        const transactionPayload = this.signTransaction(action, parameters.privateKey);

        const client = new EntityClient();
        return client.applyTransactionPayload(transactionPayload);
    }

    createChildrenProperty(parameters: CreateChildrenPropertyParameters): Promise<any> {
        const actionParameters = new CreateChildrenPropertyActionParameters(parameters.propertyName);
        const action = new TransactionAction(parameters.signer, "create-children-property", parameters.affectedEntity, actionParameters);
        const transactionPayload = this.signTransaction(action, parameters.privateKey);

        const client = new EntityClient();
        return client.applyTransactionPayload(transactionPayload);
    }

    useChildrenProperty(parameters: UseChildrenPropertyParameters): Promise<any> {
        const actionParameters = new UseChildrenPropertyActionParameters(parameters.propertyName, parameters.propertyValue);
        const action = new TransactionAction(parameters.signer, "use-children-property", parameters.affectedEntity, actionParameters);
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