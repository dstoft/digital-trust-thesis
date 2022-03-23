
import express from "express";
import bodyParser from "body-parser";

const app = express();
const port = 8080; // default port to listen

import { setupEntityController } from "./api/controller/entityController";
import { setupStateController } from "./api/controller/stateController";

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

let entityRouter = express.Router();
entityRouter = setupEntityController(entityRouter);
app.use("/entity", entityRouter);

let stateRouter = express.Router();
stateRouter = setupStateController(stateRouter);
app.use("/state", stateRouter);

// start the Express server
app.listen( port, () => {
    // tslint:disable-next-line:no-console
    console.log( `server started at http://localhost:${ port }` );
} );