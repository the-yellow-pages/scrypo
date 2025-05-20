## Starkli Cheat Sheet
### import from argent web wallet 
deploy acc and then 
```
starkli account fetch $STARKNET_ACCOUNT_ADDRESS --output "$HOME/.starkli-wallets/scrypo-argent/account.json"
```
create signature from private key (export from wallet)
```
starkli signer keystore from-key ~/.starkli-wallets/scrypo-argent/keystore.json
```

### deploy contract
```bash
starkli declare --watch target/dev/contract_user_profile.contract_class.json --strk

Enter keystore password:
Declaring Cairo 1 class: 0x0353e581a465169c441fe6280869252cd364fd21b3cb42f5541814de30be4808
Compiling Sierra class to CASM with compiler version 2.11.2...
CASM class hash: 0x0428225b05f47529be7bbf2fe4fd8d5891e634fc5f60557334f66c5e04254e50
Contract declaration transaction: 0x023fa5945efadfc0d6b186f7c7db916d8c0f5c0ce21ad5fe5bb369cd8b220b9a
Waiting for transaction 0x023fa5945efadfc0d6b186f7c7db916d8c0f5c0ce21ad5fe5bb369cd8b220b9a to confirm...
Transaction not confirmed yet...
Transaction 0x023fa5945efadfc0d6b186f7c7db916d8c0f5c0ce21ad5fe5bb369cd8b220b9a confirmed
Class hash declared:
0x0353e581a465169c441fe6280869252cd364fd21b3cb42f5541814de30be4808
```

```bash
starkli deploy 0x0353e581a465169c441fe6280869252cd364fd21b3cb42f5541814de30be4808 --strk

Enter keystore password:
Deploying class 0x0353e581a465169c441fe6280869252cd364fd21b3cb42f5541814de30be4808 with salt 0x03a1cca692a4c221b6ee42fe965755faee048e09875c28d5fcbda782dba3da8e...
The contract will be deployed at address 0x06bbf26b343bd449adc4ea8074a45710bb9679d6b68379cbd0d61696b8e2f7e4
Contract deployment transaction: 0x07b63ce267ca891fa235ad3832f6715d075f60d5b13a0042214de8f63259b12b
Contract deployed:
0x06bbf26b343bd449adc4ea8074a45710bb9679d6b68379cbd0d61696b8e2f7e4```
