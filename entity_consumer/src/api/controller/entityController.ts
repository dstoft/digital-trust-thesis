import { Router } from "express";
import { EntityService } from "../../application/entityService";

export function setupEntityController(router:Router):Router {

    router.post( "/", async ( req, res ) => {

        const entityService = new EntityService();
        const response = await entityService.createEntity(req.body);

        res.send( response );
    } );

    router.post( "/trust", async ( req, res ) => {

        const entityService = new EntityService();
        const response = await entityService.addTrust(req.body);

        res.send( response );
    } );

    router.post( "/property", async ( req, res ) => {

        const entityService = new EntityService();
        const response = await entityService.createChildrenProperty(req.body);

        res.send( response );
    } );

    router.post( "/property/use", async ( req, res ) => {

        const entityService = new EntityService();
        const response = await entityService.useChildrenProperty(req.body);

        res.send( response );
    } );

    router.post( "/lock", async ( req, res ) => {

        const entityService = new EntityService();
        const response = await entityService.lockEntity(req.body);

        res.send( response );
    } );

    return router;
}

