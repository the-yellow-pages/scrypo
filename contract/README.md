# Scrypo User Profile Contract

A Starknet smart contract for managing user profiles with messaging capabilities. This contract allows users to create profiles with names, tags, geo-coordinates, public keys, and send messages to other users.

## Prerequisites

Before you begin, ensure you have the following tools installed:

- **Scarb**: Cairo package manager and build tool (v2.11.4)
- **Starkli**: Command-line tool for Starknet interactions (v0.3.8)
- **Starknet Foundry**: Testing framework (snforge)

### Installation

1. **Install Scarb**:
   ```bash
   curl --proto '=https' --tlsv1.2 -sSf https://docs.swmansion.com/scarb/install.sh | sh
   ```

2. **Install Starkli**:
   ```bash
   curl https://get.starkli.sh | sh
   starkliup
   ```

3. **Install Starknet Foundry**:
   ```bash
   curl -L https://raw.githubusercontent.com/foundry-rs/starknet-foundry/master/scripts/install.sh | sh
   ```

4. **Verify installations**:
   ```bash
   scarb --version
   starkli --version
   snforge --version
   ```

## Environment Setup

1. **Copy environment template**:
   ```bash
   cp .env.example .env
   ```

2. **Configure your environment**:
   Edit `.env` and update the following variables:
   - `STARKNET_RPC`: Your Alchemy or Infura RPC endpoint for Starknet Sepolia
   - `STARKNET_KEYSTORE`: Path to your wallet keystore
   - `STARKNET_ACCOUNT`: Path to your account configuration

3. **Create Starknet account** (if you don't have one):
   ```bash
   # Create a new keystore
   starkli signer keystore new ~/.starkli-wallets/scrypo-argent/keystore.json
   
   # Deploy account (you'll need strk on Sepolia)
   starkli account deploy ~/.starkli-wallets/scrypo-argent/keystore.json \
     --rpc $STARKNET_RPC \
     --keystore $STARKNET_KEYSTORE
   ```

## Building the Contract

1. **Build the contract**:
   ```bash
   scarb build
   ```

2. **Check build artifacts**:
   ```bash
   ls target/dev/
   ```
   You should see `contract_user_profile.contract_class.json` and related files.

## Testing

1. **Run all tests**:
   ```bash
   scarb test
   # or
   snforge test
   ```

2. **Run tests with verbose output**:
   ```bash
   snforge test -v
   ```

3. **Run specific test**:
   ```bash
   snforge test test_name
   ```

## Deployment

### 1. Declare the Contract

First, declare your contract class to Starknet:

```bash
starkli declare target/dev/contract_user_profile.contract_class.json \
  --rpc $STARKNET_RPC \
  --keystore $STARKNET_KEYSTORE \
  --account $STARKNET_ACCOUNT
```

Save the returned class hash for the next step.

### 2. Deploy the Contract

Deploy an instance of your declared contract:

```bash
starkli deploy <CLASS_HASH> \
  --rpc $STARKNET_RPC \
  --keystore $STARKNET_KEYSTORE \
  --account $STARKNET_ACCOUNT
```

Replace `<CLASS_HASH>` with the hash returned from the declare command.

### 3. Verify Deployment

Check if your contract was deployed successfully:

```bash
starkli call <CONTRACT_ADDRESS> get_profile <YOUR_ADDRESS> \
  --rpc $STARKNET_RPC
```

## Contract Interaction

### Creating a Profile

```bash
starkli invoke <CONTRACT_ADDRESS> deploy_profile \
  str:"YourName" \
  u256:0 u256:0 u256:0 u256:0 \
  40123456 -74123456 \
  felt252:0x1234 felt252:0x5678 \
  --rpc $STARKNET_RPC \
  --keystore $STARKNET_KEYSTORE \
  --account $STARKNET_ACCOUNT
```

### Reading a Profile

```bash
starkli call <CONTRACT_ADDRESS> get_profile <USER_ADDRESS> \
  --rpc $STARKNET_RPC
```

### Sending a Message

```bash
starkli invoke <CONTRACT_ADDRESS> send_msg \
  <RECIPIENT_ADDRESS> \
  array:str:"Hello" str:"World" \
  --rpc $STARKNET_RPC \
  --keystore $STARKNET_KEYSTORE \
  --account $STARKNET_ACCOUNT
```

## Contract Features

- **Profile Management**: Create and update user profiles with name, tags, coordinates, and public keys
- **Messaging**: Send messages to other users
- **Event Emission**: Emits events for off-chain indexing
- **Persistent Storage**: Profiles are stored permanently on Starknet

### Profile Structure

Each profile contains:
- `name`: Up to 31-byte short string
- `tags0-3`: Four 256-bit limbs for tag bitfields (1024 bits total)
- `latitude/longitude`: Geo-coordinates as fixed-point integers
- `pubkey_hi/lo`: Public key split into two felt252 values

## Troubleshooting

### Common Issues

1. **RPC Connection Failed**:
   - Verify your RPC URL in `.env`
   - Check your internet connection
   - Ensure you have the correct API key

2. **Insufficient Balance**:
   - Ensure your account has enough ETH for transaction fees
   - Get testnet ETH from a Starknet Sepolia faucet

3. **Declaration Failed**:
   - Check if the contract class is already declared
   - Verify your contract compiles without errors

4. **Account Not Found**:
   - Ensure your account is deployed on the target network
   - Check the account file path in your environment

### Useful Commands

```bash
# Check account balance
starkli balance $STARKNET_ACCOUNT_ADDRESS --rpc $STARKNET_RPC

# Get transaction receipt
starkli receipt <TX_HASH> --rpc $STARKNET_RPC

# Get contract info
starkli class-at <CONTRACT_ADDRESS> --rpc $STARKNET_RPC
```

## Resources

- [Starknet Foundry Documentation](https://foundry-rs.github.io/starknet-foundry/)
- [Scarb Documentation](https://docs.swmansion.com/scarb/)
- [Starkli Documentation](https://book.starkli.rs/)
- [Starknet Developer Documentation](https://docs.starknet.io/)

