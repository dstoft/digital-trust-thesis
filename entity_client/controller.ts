import express from "express";
import bodyParser from "body-parser";

const app = express();
const port = 8081; // default port to listen

import { EntityClient } from './client';
import { TransactionPayload } from "entity_shared/types";
const client = new EntityClient();

export function setup() {
    app.use(bodyParser.urlencoded({ extended: false }));
    app.use(bodyParser.json());
    const router = express.Router();
    app.use("/", router);

    router.post( "/", async ( req, res ) => {
        const transactionPayload = new TransactionPayload(req.body.payload, req.body.signature);
        const response = await client.create(transactionPayload);
        res.send( response );
    } );

    // start the Express server
    app.listen( port, () => {
        // tslint:disable-next-line:no-console
        console.log( `server started at http://localhost:${ port }` );
    } );
}

