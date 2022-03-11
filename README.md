# digital-trust-thesis
A monorepo for the digital trust thesis project in collaboration with Energinet.


## Compiling sawtooth-sdk-javascript-main
Following the cmds from "bin" folder, should be executed in the sawtooth-sdk-javascript-main folder:
```
rm -r node_modules
npm install --no-bin-links
npm run compile_protobuf
```

This requires Visual Studio 2017 or newer, and can be installed from https://github.com/nodejs/node-gyp#on-windows. (Also Python as mentioned). 