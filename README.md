**Scrypo – Connecting Crypto Wallets on the Map**

Scrypo is a geolocation-based Web3 application that bridges the physical and digital worlds of blockchain. It enables users to discover, connect, and interact with nearby crypto wallets—visually represented as anonymized pins on a dynamic world map, categorized by activity tags. Scrypo unlocks hyper-local interactions in the decentralized ecosystem, fostering global nomad communities and enabling real-world crypto experiences.

Whether you're attending a conference, exploring a new city, or just engaging with local Web3 culture, Scrypo makes the invisible visible by mapping the global crypto network in real time.

## How to Launch Project

To run the complete Scrypo application, follow these steps in order:

### 1. Deploy Smart Contract
First, deploy the user profile contract to Starknet and note the contract address.
- See [Contract README](./contract/README.md) for detailed deployment instructions

### 2. Setup and Run Indexer
Build and run the Docker container for the profiles indexer:
```bash
cd profiles-indexer
docker-compose up -d
pnpm drizzle-kit push
cp .env.example .env
```
set up `.env` with your database connection details and other configurations:

- See [Profiles Indexer README](./profiles-indexer/README.md) for complete setup

### 3. Run Apibara
Start the Apibara indexing service to listen for contract events:
```bash
cd profiles-indexer
pnpm run dev
```

### 4. Run Express Server
Start the API server for the frontend:
```bash
cd profiles-indexer
pnpm run dev:server
```

### 5. Run Frontend
Finally, start the React frontend application:
```bash
cd frontend
npm install
npm run dev
cp .env.example .env
```
set up `.env` with your database connection details and other configurations:
- See [Frontend README](./frontend/README.md) for development details

The application will be available at `http://localhost:5173` with the backend API running on the configured port.

**Key Features:**

* **Anonymized Wallet Mapping:** Users appear as pins on a map, tagged by interests and activity, enabling discovery without compromising privacy.
* **On-Chain Messaging:** Encrypted messages can be sent between users using public keys generated from wallet signature.
* **Crypto for Local Services:** Local businesses and freelancers can offer services in exchange for cryptocurrency, targeting nearby users.
* **Nomad Networking:** Build meaningful connections with like-minded travelers, digital nomads, and crypto enthusiasts based on location and interests.

**Tech Stack:**

* **Starknet (Cairo):** Smart contracts for user profiles and encrypted on-chain messaging.
* **Apibara:** Event indexing and real-time data streaming from Starknet.
* **React:** Frontend interface for the interactive map and user experience.

Scrypo brings a new dimension to Web3 social interaction by making location a meaningful layer in the decentralized web.

## Architecture Overview

### Off-chain indexer
```
┌────────┐   ①tx emits event    ┌─────────────┐  ③transform   ┌────────────────┐
│ Starknet│ ───────────────────►│  Apibara    │──────────────►│  Postgres+GIS  │
│  node   │   (ProfileUpdated)  │  indexer    │   JSON rows   │  (or Mongo XYZ)│
└────────┘                      └─────────────┘               └────┬───────────┘
▲ ②front-end queries                ▲ ④SQL bbox query      │
│    contract for single profile    │                      │
│                                   │                      │
┌────────┴────────┐                    ┌─────┴────────┐      ┌──────▼───────┐
│ React / map SDK │◄───────────────────│ REST / Graph │◄─────│ PostGIS gist │
└─────────────────┘    geo-bbox list   └──────────────┘      └──────────────┘

```


### Messages 

For now we keep the exact same typedData payload you will get the same X-25519 key-pair every time, 
provided the wallet uses the usual deterministic-k signer (RFC 6979) that Argent X, Braavos and the starknet.js stack rely on today.

```javascript
const rawSig = await starknet.account.signMessage(typedData); // ["0x r", "0x s"]
const sigHex = rawSig.join('').replace(/^0x/, '');            // concat r || s
// ➌ hash it → 32-byte seed
const seed   = keccak_256(sigHex);
// ➍ turn seed into an X25519 key-pair (libsodium, 32-byte keys)
const { publicKey, privateKey } = sodium.crypto_box_seed_keypair(seed);
```
Why Keccak? – hashing normalises signature length, hides “r ‖ s” structure and gives us exactly 256 bits of uniform entropy.

Why X25519, not Stark curve? – X25519 is 32 bytes, already supported by every web-crypto library, and independent from the wallet’s signing curve; there is no on-chain link between this pub-key and your StarkNet account.

We use assymmetric encryption for now because it's enough to share contact (XMTP or whatever).

Caveats & good practices

| Issue                              | Mitigation                                                                                                                                      |
| ---------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------- |
| **Wallet adds randomness one day** | Cache the *first* signature or export the derived secret so future log-ins don’t break older messages.                                          |
| **Key rotation**                   | Let the user sign the *same* payload but **version++** the `domain.version` field, then send a new `set_pub()`. Peers check the latest version. |
| **Network split**                  | mainnet vs testnet produce different keys—store separate `profile` contracts or include chainId in the storage slot.                            |
| **Replay-attack on `set_pub`**     | Just store the latest value; Starknet’s storage overwrite rules and the tx’s `nonce` protect against replay.                                    |
| **Two-way chat**                   | Each user posts their own pub key once; every pair does DH locally—still one tx per user.                                                       |

### Tags
WIP

### Events
WIP

### XMTP support
WIP
