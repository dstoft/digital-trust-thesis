import { UseChildrenPropertyActionParameters } from "./UseChildrenPropertyActionParameters";
import { CreateChildrenPropertyActionParameters } from "./CreateChildrenPropertyActionParameters";
import { AddTrustActionParameters } from "./AddTrustActionParameters";
import { CreateActionParameters } from "./CreateActionParameters";

export abstract class ActionParameters {

    static fromBase64(string: string, action: string) {
        if (action === "create") {
            return CreateActionParameters.fromBase64(string);
        } else if (action === "add-trust") {
            return AddTrustActionParameters.fromBase64(string);
        } else if (action === "create-children-property") {
            return CreateChildrenPropertyActionParameters.fromBase64(string);
        } else if (action === "use-children-property") {
            return UseChildrenPropertyActionParameters.fromBase64(string);
        } else {
            throw new RangeError("ActionParameters does not recognize the provided action!");
        }
    }

    abstract toBuffer(): Buffer;
}
