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
