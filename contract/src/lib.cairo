// SPDX-License-Identifier: MIT
// UserProfile — Cairo v2.5‑style contract (2025‑05‑15)
// Stores a per‑account profile with name, 2016‑bit (8 felts) tag bit‑field and geo‑coordinates.
// Emits `ProfileUpdated` events for off‑chain indexing.

use starknet::ContractAddress;

#[starknet::interface]
pub trait IProfileRegistry<TContractState> {
    /// Create or update (idempotent) the caller's profile.
    fn deploy_profile(
        ref self: TContractState,
        name: felt252,
        tags0: u256,
        tags1: u256,
        tags2: u256,
        tags3: u256,
        latitude: felt252,
        longitude: felt252,
        pubkey_hi: felt252,
        pubkey_lo: felt252,
    );
    /// Read a stored profile.
    fn get_profile(self: @TContractState, addr: ContractAddress) -> user_profile::Profile;
    /// Send a message to another user
    fn send_msg(ref self: TContractState, recipient: ContractAddress, msg: Array<felt252>);
}

#[starknet::contract]
mod user_profile {
    use starknet::{ContractAddress, get_caller_address};
    use starknet::storage::{StorageMapWriteAccess, StorageMapReadAccess, Map};
    use core::integer::u256;
    use core::array::ArrayTrait;

    /// Persistent storage layout.
    #[storage]
    struct Storage {
        profiles: Map<ContractAddress, Profile>,
    }

    /// Serializable & storable profile structure.
    #[derive(Drop, Serde, starknet::Store)]
    pub struct Profile {
        /// Up to 31‑byte short‑string packed in a felt252.
        name: felt252,
        /// Four 256‑bit limbs = 1024 bits of tags. (extensible to 2016 bits total)
        tags0: u256,
        tags1: u256,
        tags2: u256,
        tags3: u256,
        /// Coordinates — signed fixed‑point integers (deg × 1e6) in felts.
        latitude: felt252,
        longitude: felt252,
        /// Public key split into two felt252 values
        pubkey_hi: felt252,
        pubkey_lo: felt252,
    }

    /// Event emitted every time a profile is created or updated.
    #[event]
    #[derive(Drop, starknet::Event)]
    pub enum Event {
        ProfileUpdated: ProfileUpdated,
        MessageSent: MessageSent,
    }

    #[derive(Drop, starknet::Event)]
    pub struct ProfileUpdated {
        addr: ContractAddress,
        name: felt252,
        tags0: u256,
        tags1: u256,
        tags2: u256,
        tags3: u256,
        latitude: felt252,
        longitude: felt252,
        pubkey_hi: felt252,
        pubkey_lo: felt252,
    }

    #[derive(Drop, starknet::Event)]
    pub struct MessageSent {
        sender: ContractAddress,
        recipient: ContractAddress,
        message: Array<felt252>,
    }

    /// ABI implementation exposing the public interface.
    #[abi(embed_v0)]
    impl UserProfile of super::IProfileRegistry<ContractState> {
        /// Deploy or update caller's profile.
        fn deploy_profile(
            ref self: ContractState,
            name: felt252,
            tags0: u256,
            tags1: u256,
            tags2: u256,
            tags3: u256,
            latitude: felt252,
            longitude: felt252,
            pubkey_hi: felt252,
            pubkey_lo: felt252,
        ) {
            let caller = get_caller_address();

            let profile = Profile { 
                name, 
                tags0, 
                tags1, 
                tags2, 
                tags3, 
                latitude, 
                longitude,
                pubkey_hi,
                pubkey_lo,
            };

            self.profiles.write(caller, profile);
            // Emit event for off‑chain indexers
            self
                .emit(
                    ProfileUpdated {
                        addr: caller, 
                        name, 
                        tags0, 
                        tags1, 
                        tags2, 
                        tags3, 
                        latitude, 
                        longitude,
                        pubkey_hi,
                        pubkey_lo,
                    },
                );
        }

        /// View function to fetch a profile by address.
        fn get_profile(self: @ContractState, addr: ContractAddress) -> Profile {
            self.profiles.read(addr)
        }

        /// Send a message to another user
        fn send_msg(
            ref self: ContractState,
            recipient: ContractAddress,
            msg: Array<felt252>,
        ) {
            let sender = get_caller_address();
            
            // Emit message sent event
            self.emit(
                MessageSent {
                    sender,
                    recipient,
                    message: msg,
                },
            );
        }
    }
}
