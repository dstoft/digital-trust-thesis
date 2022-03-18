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

    // define a route handler for the default home page
    router.get( "/", ( req, res ) => {
        res.send( "Hello world!" );
    } );

    router.post( "/entity", async ( req, res ) => {
        // tslint:disable-next-line:no-console
        console.log(req.body);

        const entityService = new EntityService();
        const response = await entityService.createEntity(req.body);

        res.send( response );
    } );

    // start the Express server
    app.listen( port, () => {
        // tslint:disable-next-line:no-console
        console.log( `server started at http://localhost:${ port }` );
    } );
}

