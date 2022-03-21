import express from "express";
import bodyParser from "body-parser";

const app = express();
const port = 8080; // default port to listen

import { EntityService } from "../../application/entityService";

export function setup() {
    app.use(bodyParser.urlencoded({ extended: false }));
    app.use(bodyParser.json());
    const router = express.Router();
    app.use("/", router);

    router.post( "/entity", async ( req, res ) => {

        const entityService = new EntityService();
        const response = await entityService.createEntity(req.body);

        res.send( response );
    } );

    router.post( "/entity/trust", async ( req, res ) => {

        const entityService = new EntityService();
        const response = await entityService.addTrust(req.body);

        res.send( response );
    } );

    router.post( "/entity/property", async ( req, res ) => {

        const entityService = new EntityService();
        const response = await entityService.createChildrenProperty(req.body);

        res.send( response );
    } );

    router.post( "/entity/property/use", async ( req, res ) => {

        const entityService = new EntityService();
        const response = await entityService.useChildrenProperty(req.body);

        res.send( response );
    } );

    router.post( "/entity/lock", async ( req, res ) => {

        const entityService = new EntityService();
        const response = await entityService.lockEntity(req.body);

        res.send( response );
    } );

    // start the Express server
    app.listen( port, () => {
        // tslint:disable-next-line:no-console
        console.log( `server started at http://localhost:${ port }` );
    } );
}

