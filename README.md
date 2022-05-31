# digital-trust-thesis
A monorepo for the digital trust thesis project in collaboration with Energinet.

The "sawtooth-sdk-javascript-main" is a copy of https://github.com/hyperledger/sawtooth-sdk-javascript/tree/4db07405980d6bf215da2f27975aff3192f412f5

Below is the required steps to run the project. Consider using the scenarios from the "knowledge" folder.

## Steps to run
The goal is to have the Hyperledger Sawtooth docker containers running, an instance of "entity_handler", an instance of "entity_client", and an instance of "entity_consumer" running.
All steps should start from the root of this project.
Some of the folders may contain additional information, however, these steps should be the only necessary ones to run the project overall.

### Compiling the entity_shared
"Entity_shared" is required by the entity services, therefore it will have to be compiled first. This is done by navigating into the folder "entity_shared" and running these two commands:
```
npm i
```
```
npx tsc
```

### Compiling sawtooth-sdk-javascript-main
Make sure that Visual Studio 2017 or newer is installed, and can be installed from https://github.com/nodejs/node-gyp#on-windows. (Also Python). 
Navigate to the "sawtooth-sdk-javascript-main" folder, and execute the following commands: 
(do note that the test may fail, with "standard being an unrecognized command") 
(it is recommended to remove the node_modules folder if the installation has been attempted before)
```
npm install --no-bin-links
```

### Run the Hyperledger Sawtooth docker containers
Navigate to "Sawtooth\single-node" and run the following command:
```
docker-compose -f sawtooth-default.yaml up
```
Consider adding "--force-recreate" at the end to remove any data by previous Sawtooth containers.
It may take a minute or two before the containers are fully up and running. The blockchain is running when the Consensus Engine is activated and the blockchain attempts to send PingResponse (and it may not receive any, which is fine)

### Run the entity handler
After the Sawtooth docker container has started up, navigate to the "entity_handler" folder and run the following commands:
```
npm i
```
```
npm start
```

### Run the entity client
After the entity handler has started up and is still running, navigate to the "entity_client" folder and run the following commands:
```
npm i
```
```
npm start
```

### Run the entity consumer
After the entity client has started up and is still running, navigate to the "entity_consumer" folder and run the following commands:
```
npm i
```
```
npm start
```


