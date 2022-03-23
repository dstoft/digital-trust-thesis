import { Router } from "express";
import { TrustChainService } from "../../application/trustChainService";

export function setupStateController(router:Router):Router {
    router.get( "/trust/:entityName", async ( req, res ) => {
        const service = new TrustChainService();
        const response = await service.getFrom(req.params.entityName, new Map());
        res.send( Object.fromEntries(response) );
    } );

    return router;
}