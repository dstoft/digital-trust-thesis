# Scenario with customer agreement
The goal is to create an agreement between two customers that does not trust eachother.

## Steps
Create trust anchor, named "Energistyrelsen"
```
curl --location --request POST "localhost:8081" --header "Content-Type: application/json" --data-raw "{\"payload\": \"dHJ1c3QtYW5jaG9yLGNyZWF0ZSxFbmVyZ2lzdHlyZWxzZW4sTUROak9HWTVZbU14WVRKalpESTFPR0k0Wm1GbU5UazRNVEJrTkRnMVpqSTNPVGhpT1RFNU1qUTNOall3TWpKak56VXlZMll6TnpNNVpUVm1PV1U0Tm1RMw==\",\"signature\": \"2b294c5561b8ed661e70a60e34398b35a421638b35255adc8d0780a969cd44d048505baafc87bdfedb98526ce6376b4d9a1fd5dae128e7425505ab7c3883e873\"}"
```

Create energi fyn
```
curl --location --request POST "localhost:8080/entity" --header "Content-Type: application/json" --data-raw "{\"publicKey\": \"033620b541fd6b6ac438f29f96ccf2632ffd46efe16e95fe79e1c647b90891aea3\",\"signer\": \"Energistyrelsen\",\"affectedEntity\": \"energi fyn\",\"privateKey\": \"7ea84cef1bfbc0fcfb49fc685c60d990fd55d3b20531af369fabedf9c7ddbd8d\"}"
```

Create jill, parent: energi fyn
```
curl --location --request POST "localhost:8080/entity" --header "Content-Type: application/json" --data-raw "{\"publicKey\": \"03e47237679aed5d87b81d641971059b57b730ed8f113215c13303ac5c1a6b712f\",\"signer\": \"energi fyn\",\"affectedEntity\": \"jill\",\"privateKey\": \"0906aafe6090a02f9751ec289c270623d7d4a7e5a4440429a82886d7ca4bbb99\"}"
```

Create property on jill: title
```
curl --location --request POST "localhost:8080/entity/property" --header "Content-Type: application/json" --data-raw "{\"propertyName\": \"title\",\"signer\": \"jill\",\"affectedEntity\": \"jill\",\"privateKey\": \"0cd09d0b3f181afa4f6e162dbb225dfdf881b364f2d39a008bd819cc5420f187\"}"
```

Create property on jill: amount in kwh
```
curl --location --request POST "localhost:8080/entity/property" --header "Content-Type: application/json" --data-raw "{\"propertyName\": \"amount in kwh\",\"signer\": \"jill\",\"affectedEntity\": \"jill\",\"privateKey\": \"0cd09d0b3f181afa4f6e162dbb225dfdf881b364f2d39a008bd819cc5420f187\"}"
```

Create property on jill: period
```
curl --location --request POST "localhost:8080/entity/property" --header "Content-Type: application/json" --data-raw "{\"propertyName\": \"period\",\"signer\": \"jill\",\"affectedEntity\": \"jill\",\"privateKey\": \"0cd09d0b3f181afa4f6e162dbb225dfdf881b364f2d39a008bd819cc5420f187\"}"
```

Create property on jill: total price
```
curl --location --request POST "localhost:8080/entity/property" --header "Content-Type: application/json" --data-raw "{\"propertyName\": \"total price\",\"signer\": \"jill\",\"affectedEntity\": \"jill\",\"privateKey\": \"0cd09d0b3f181afa4f6e162dbb225dfdf881b364f2d39a008bd819cc5420f187\"}"
```

Create agreement, parent: jill
```
curl --location --request POST "localhost:8080/entity" --header "Content-Type: application/json" --data-raw "{\"publicKey\": \"023f0df14bebe7ca368cca135bf8fd24b879ed1f1c8d11bb3243aaab03ceb5753a\",\"signer\": \"jill\",\"affectedEntity\": \"agreement\",\"privateKey\": \"0cd09d0b3f181afa4f6e162dbb225dfdf881b364f2d39a008bd819cc5420f187\"}"
```

Use title property on agreement with "sell electricity"
```
curl --location --request POST "localhost:8080/entity/property/use" --header "Content-Type: application/json" --data-raw "{\"propertyName\": \"title\",\"propertyValue\": \"sell electricity\",\"signer\": \"jill\",\"affectedEntity\": \"agreement\",\"privateKey\": \"0cd09d0b3f181afa4f6e162dbb225dfdf881b364f2d39a008bd819cc5420f187\"}"
```

Use amount in kwh property on agreement with "20"
```
curl --location --request POST "localhost:8080/entity/property/use" --header "Content-Type: application/json" --data-raw "{\"propertyName\": \"amount in kwh\",\"propertyValue\": \"20\",\"signer\": \"jill\",\"affectedEntity\": \"agreement\",\"privateKey\": \"0cd09d0b3f181afa4f6e162dbb225dfdf881b364f2d39a008bd819cc5420f187\"}"
```

Use period property on agreement with "06/04/2022"
```
curl --location --request POST "localhost:8080/entity/property/use" --header "Content-Type: application/json" --data-raw "{\"propertyName\": \"period\",\"propertyValue\": \"06/04/2022\",\"signer\": \"jill\",\"affectedEntity\": \"agreement\",\"privateKey\": \"0cd09d0b3f181afa4f6e162dbb225dfdf881b364f2d39a008bd819cc5420f187\"}"
```

Use total price property on agreement with "5.15"
```
curl --location --request POST "localhost:8080/entity/property/use" --header "Content-Type: application/json" --data-raw "{\"propertyName\": \"total price\",\"propertyValue\": \"5.15\",\"signer\": \"jill\",\"affectedEntity\": \"agreement\",\"privateKey\": \"0cd09d0b3f181afa4f6e162dbb225dfdf881b364f2d39a008bd819cc5420f187\"}"
```

Lock agreement
```
curl --location --request POST "localhost:8080/entity/lock" --header "Content-Type: application/json" --data-raw "{\"signer\": \"jill\",\"affectedEntity\": \"agreement\",\"privateKey\": \"0cd09d0b3f181afa4f6e162dbb225dfdf881b364f2d39a008bd819cc5420f187\"}"
```

Add trust from Energistyrelsen to energi fyn
```
curl --location --request POST "localhost:8080/entity/trust" --header "Content-Type: application/json" --data-raw "{\"signer\": \"Energistyrelsen\",\"affectedEntity\": \"energi fyn\",\"privateKey\": \"7ea84cef1bfbc0fcfb49fc685c60d990fd55d3b20531af369fabedf9c7ddbd8d\"}"
```

Add trust from energi fyn to jill
```
curl --location --request POST "localhost:8080/entity/trust" --header "Content-Type: application/json" --data-raw "{\"signer\": \"energi fyn\",\"affectedEntity\": \"jill\",\"privateKey\": \"0906aafe6090a02f9751ec289c270623d7d4a7e5a4440429a82886d7ca4bbb99\"}"
```

Add trust from jill to agreement
```
curl --location --request POST "localhost:8080/entity/trust" --header "Content-Type: application/json" --data-raw "{\"signer\": \"jill\",\"affectedEntity\": \"agreement\",\"privateKey\": \"0cd09d0b3f181afa4f6e162dbb225dfdf881b364f2d39a008bd819cc5420f187\"}"
```

Create jack, parent: energi fyn
```
curl --location --request POST "localhost:8080/entity" --header "Content-Type: application/json" --data-raw "{\"publicKey\": \"03813ce91274d70b3da9d299eb294367aeb94a7f237820d0e3b27d34e82e24ceb7\",\"signer\": \"energi fyn\",\"affectedEntity\": \"jack\",\"privateKey\": \"0906aafe6090a02f9751ec289c270623d7d4a7e5a4440429a82886d7ca4bbb99\"}"
```

Add trust from energi fyn to jack
```
curl --location --request POST "localhost:8080/entity/trust" --header "Content-Type: application/json" --data-raw "{\"signer\": \"energi fyn\",\"affectedEntity\": \"jack\",\"privateKey\": \"0906aafe6090a02f9751ec289c270623d7d4a7e5a4440429a82886d7ca4bbb99\"}"
```

Add trust from jack to agreement
```
curl --location --request POST "localhost:8080/entity/trust" --header "Content-Type: application/json" --data-raw "{\"signer\": \"jack\",\"affectedEntity\": \"agreement\",\"privateKey\": \"92ff7a57aa37779e16be3834d329c42db817b8acfc8a04b6a86a47551c9cecc0\"}"
```


## Optional steps
View agreement trust chain
```
curl --location --request GET "localhost:8080/state/trust/agreement"
```



## Used key pairs:
Energistyrelsen:
```
7ea84cef1bfbc0fcfb49fc685c60d990fd55d3b20531af369fabedf9c7ddbd8d
03c8f9bc1a2cd258b8faf59810d485f2798b91924766022c752cf3739e5f9e86d7
```

energi fyn:
```
0906aafe6090a02f9751ec289c270623d7d4a7e5a4440429a82886d7ca4bbb99
033620b541fd6b6ac438f29f96ccf2632ffd46efe16e95fe79e1c647b90891aea3
```

jill:
```
0cd09d0b3f181afa4f6e162dbb225dfdf881b364f2d39a008bd819cc5420f187
03e47237679aed5d87b81d641971059b57b730ed8f113215c13303ac5c1a6b712f
```

jack:
```
92ff7a57aa37779e16be3834d329c42db817b8acfc8a04b6a86a47551c9cecc0
03813ce91274d70b3da9d299eb294367aeb94a7f237820d0e3b27d34e82e24ceb7
```

agreement:
```
76550b927c0e698df0d7c05005354dc043401a832b79fd7a31e47112c08516c8
023f0df14bebe7ca368cca135bf8fd24b879ed1f1c8d11bb3243aaab03ceb5753a
```