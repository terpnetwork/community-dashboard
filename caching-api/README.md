# Caching API

## Features

- provides headstash details
- feegrants address derived from content of eth_signature

### Get Headstash Details

`https://headstash-api.terp.network/getAmount/<your-eth-pubkey>`

### Register Fee Grant

Support to cover fees for new wallets is implemented. This API expects an ecrypted signature hash to securely verify a requesting fee-grantee is able to be granted one.

`/feeGrant/:<signing-address>/:<cosmos-address>/:<encrypted-signature>`

## Deploying

### 1. Configure `.env`

First, configure the enviroment variables. An example file is able to be referenced:

```
cp .env.example .env
```

### 2. Build Image

### Docker Containter

To build the docker image:

```sh
docker build -t terpnetwork/headstash-api:v0.0.1 .
```

To run the image in a container:

```sh
 docker run -p 3001:3001 terpnetwork/headstash-api:v0.0.1
```

### Akash SDL

### Research

- https://medium.com/mycrypto/the-magic-of-digital-signatures-on-ethereum-98fe184dc9c7
- https://medium.com/@kaishinaw/signing-and-verifying-ethereum-hashed-messages-fefa46a746f2
