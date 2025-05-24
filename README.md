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
```
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
```
- See [Frontend README](./frontend/README.md) for development details

The application will be available at `http://localhost:5173` with the backend API running on the configured port.

**Key Features:**

* **Anonymized Wallet Mapping:** Users appear as pins on a map, tagged by interests and activity, enabling discovery without compromising privacy.
* **On-Chain Messaging:** Encrypted messages can be sent between users using public keys generated during profile creation.
* **Crypto for Local Services:** Local businesses and freelancers can offer services in exchange for cryptocurrency, targeting nearby users.
* **Nomad Networking:** Build meaningful connections with like-minded travelers, digital nomads, and crypto enthusiasts based on location and interests.

**Tech Stack:**

* **Starknet (Cairo):** Smart contracts for user profiles and encrypted on-chain messaging.
* **Apibara:** Event indexing and real-time data streaming from Starknet.
* **React:** Frontend interface for the interactive map and user experience.

Scrypo brings a new dimension to Web3 social interaction by making location a meaningful layer in the decentralized web.
