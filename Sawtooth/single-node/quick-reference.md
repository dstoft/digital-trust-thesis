## Quick reference
From https://sawtooth.hyperledger.org/docs/core/releases/latest/app_developers_guide/docker.html
```
docker-compose -f sawtooth-default.yaml up

docker exec -it sawtooth-shell-default bash
curl http://rest-api:8008/blocks
intkey create_batch --count 10 --key-count 5
intkey load -f batches.intkey --url http://rest-api:8008
intkey create_batch --count 10 --key-count 5
sawtooth batch submit -f batches.intkey --url http://rest-api:8008
sawtooth block list --url http://rest-api:8008
sawtooth block show --url http://rest-api:8008 {BLOCK_ID}
sawtooth state list --url http://rest-api:8008
sawtooth state show --url http://rest-api:8008 {STATE_ADDRESS}
```

## XO game
From https://sawtooth.hyperledger.org/docs/core/releases/latest/app_developers_guide/intro_xo_transaction_family.html

```
sawtooth keygen jack
sawtooth keygen jill
xo create my-game --username jack --url http://rest-api:8008
xo list --url http://rest-api:8008
xo take my-game 5 --username jack --url http://rest-api:8008
xo take my-game 1 --username jill --url http://rest-api:8008
xo show my-game --url http://rest-api:8008
xo delete my-game --url http://rest-api:8008
```

http://localhost:8008/batch_statuses?id=c3e9660c791b9dcfb6196935cd7d04e79927d655323a46197f93fd85b524cc153d7c56211ad0203b287b6336065ac13552a270c5ad51c59bc671b9c695118ea2