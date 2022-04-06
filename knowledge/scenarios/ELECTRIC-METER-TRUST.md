# Scenario with electric meter trust
The goal is to create an electric meter that can be trusted, because it is made by a trusted manufactorer and installed by a trusted installer.

## Steps
Create trust anchor, named "Energistyrelsen"
```
curl --location --request POST "localhost:8081" --header "Content-Type: application/json" --data-raw "{\"payload\": \"dHJ1c3QtYW5jaG9yLGNyZWF0ZSxFbmVyZ2lzdHlyZWxzZW4sTUROak9HWTVZbU14WVRKalpESTFPR0k0Wm1GbU5UazRNVEJrTkRnMVpqSTNPVGhpT1RFNU1qUTNOall3TWpKak56VXlZMll6TnpNNVpUVm1PV1U0Tm1RMw==\",\"signature\": \"2b294c5561b8ed661e70a60e34398b35a421638b35255adc8d0780a969cd44d048505baafc87bdfedb98526ce6376b4d9a1fd5dae128e7425505ab7c3883e873\"}"
```

Create meter manufactor, named "meter manufactorer"
```
curl --location --request POST "localhost:8080/entity" --header "Content-Type: application/json" --data-raw "{\"publicKey\": \"033620b541fd6b6ac438f29f96ccf2632ffd46efe16e95fe79e1c647b90891aea3\",\"signer\": \"Energistyrelsen\",\"affectedEntity\": \"meter manufactorer\",\"privateKey\": \"7ea84cef1bfbc0fcfb49fc685c60d990fd55d3b20531af369fabedf9c7ddbd8d\"}"
```

Create property on meter manufactor children, named "serial number"
```
curl --location --request POST "localhost:8080/entity/property" --header "Content-Type: application/json" --data-raw "{\"propertyName\": \"serial number\",\"signer\": \"meter manufactorer\",\"affectedEntity\": \"meter manufactorer\",\"privateKey\": \"0906aafe6090a02f9751ec289c270623d7d4a7e5a4440429a82886d7ca4bbb99\"}"
```

Create meter installer, named "meter installer"
```
curl --location --request POST "localhost:8080/entity" --header "Content-Type: application/json" --data-raw "{\"publicKey\": \"03e47237679aed5d87b81d641971059b57b730ed8f113215c13303ac5c1a6b712f\",\"signer\": \"Energistyrelsen\",\"affectedEntity\": \"meter installer\",\"privateKey\": \"7ea84cef1bfbc0fcfb49fc685c60d990fd55d3b20531af369fabedf9c7ddbd8d\"}"
```

Create meter, named "meter", owned by manufactorer
```
curl --location --request POST "localhost:8080/entity" --header "Content-Type: application/json" --data-raw "{\"publicKey\": \"03813ce91274d70b3da9d299eb294367aeb94a7f237820d0e3b27d34e82e24ceb7\",\"signer\": \"meter manufactorer\",\"affectedEntity\": \"meter\",\"privateKey\": \"0906aafe6090a02f9751ec289c270623d7d4a7e5a4440429a82886d7ca4bbb99\"}"
```

Use "serial number" property from parent with value "12345"
```
curl --location --request POST "localhost:8080/entity/property/use" --header "Content-Type: application/json" --data-raw "{\"propertyName\": \"serial number\",\"propertyValue\": \"12345\",\"signer\": \"meter manufactorer\",\"affectedEntity\": \"meter\",\"privateKey\": \"0906aafe6090a02f9751ec289c270623d7d4a7e5a4440429a82886d7ca4bbb99\"}"
```

Add trust from meter manufactor to meter
```
curl --location --request POST "localhost:8080/entity/trust" --header "Content-Type: application/json" --data-raw "{\"signer\": \"meter manufactorer\",\"affectedEntity\": \"meter\",\"privateKey\": \"0906aafe6090a02f9751ec289c270623d7d4a7e5a4440429a82886d7ca4bbb99\"}"
```

Add trust from installer to meter
```
curl --location --request POST "localhost:8080/entity/trust" --header "Content-Type: application/json" --data-raw "{\"signer\": \"meter installer\",\"affectedEntity\": \"meter\",\"privateKey\": \"0cd09d0b3f181afa4f6e162dbb225dfdf881b364f2d39a008bd819cc5420f187\"}"
```

Add trust from Energistyrelsen to meter manufactor
```
curl --location --request POST "localhost:8080/entity/trust" --header "Content-Type: application/json" --data-raw "{\"signer\": \"Energistyrelsen\",\"affectedEntity\": \"meter manufactorer\",\"privateKey\": \"7ea84cef1bfbc0fcfb49fc685c60d990fd55d3b20531af369fabedf9c7ddbd8d\"}"
```

Add trust from Energistyrelsen to meter installer
```
curl --location --request POST "localhost:8080/entity/trust" --header "Content-Type: application/json" --data-raw "{\"signer\": \"Energistyrelsen\",\"affectedEntity\": \"meter installer\",\"privateKey\": \"7ea84cef1bfbc0fcfb49fc685c60d990fd55d3b20531af369fabedf9c7ddbd8d\"}"
```

## Optional steps
View meter trust chain
```
curl --location --request GET "localhost:8080/state/trust/meter"
```

Use public key from meter to create trusted measurements!

## Used key pairs:
Energistyrelsen:
```
7ea84cef1bfbc0fcfb49fc685c60d990fd55d3b20531af369fabedf9c7ddbd8d
03c8f9bc1a2cd258b8faf59810d485f2798b91924766022c752cf3739e5f9e86d7
```

meter manufactor:
```
0906aafe6090a02f9751ec289c270623d7d4a7e5a4440429a82886d7ca4bbb99
033620b541fd6b6ac438f29f96ccf2632ffd46efe16e95fe79e1c647b90891aea3
```

meter installer:
```
0cd09d0b3f181afa4f6e162dbb225dfdf881b364f2d39a008bd819cc5420f187
03e47237679aed5d87b81d641971059b57b730ed8f113215c13303ac5c1a6b712f
```

meter:
```
92ff7a57aa37779e16be3834d329c42db817b8acfc8a04b6a86a47551c9cecc0
03813ce91274d70b3da9d299eb294367aeb94a7f237820d0e3b27d34e82e24ceb7
```