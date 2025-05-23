import { type Abi } from "@starknet-react/core"

const profileRegistryAbi = [
    {
        type: "function",
        name: "deploy_profile",
        state_mutability: "external",
        inputs: [
            {
                name: "name",
                type: "core::felt252",
            },
            {
                name: "tags0",
                type: "core::integer::u256",
            },
            {
                name: "tags1",
                type: "core::integer::u256",
            },
            {
                name: "tags2",
                type: "core::integer::u256",
            },
            {
                name: "tags3",
                type: "core::integer::u256",
            },
            {
                name: "latitude",
                type: "core::felt252",
            },
            {
                name: "longitude",
                type: "core::felt252",
            },
            {
                name: "pubkey_hi",
                type: "core::felt252",
            },
            {
                name: "pubkey_lo",
                type: "core::felt252",
            },
        ],
        outputs: [],
    },
    {
        type: "function",
        name: "get_profile",
        state_mutability: "view",
        inputs: [
            {
                name: "addr",
                type: "core::starknet::contract_address::ContractAddress",
            },
        ],
        outputs: [
            {
                type: "core::felt252",
            },
            {
                type: "core::integer::u256",
            },
            {
                type: "core::integer::u256",
            },
            {
                type: "core::integer::u256",
            },
            {
                type: "core::integer::u256",
            },
            {
                type: "core::felt252",
            },
            {
                type: "core::felt252",
            },
            {
                type: "core::felt252",
            },
            {
                type: "core::felt252",
            },
        ],
    },
    {
        type: "function",
        name: "send_msg",
        state_mutability: "external",
        inputs: [
            {
                name: "recipient",
                type: "core::starknet::contract_address::ContractAddress",
            },
            {
                name: "msg",
                type: "core::array::Array::<core::felt252>",
            }
        ],
        outputs: [],
    },
    {
        type: "event",
        name: "Event",
        kind: "enum",
        variants: [
            {
                name: "ProfileUpdated",
                type: "ProfileUpdated",
                kind: "data"
            },
            {
                name: "MessageSent",
                type: "MessageSent",
                kind: "data"
            }
        ]
    },
    {
        type: "struct",
        name: "ProfileUpdated",
        members: [
            {
                name: "addr",
                type: "core::starknet::contract_address::ContractAddress"
            },
            {
                name: "name",
                type: "core::felt252"
            },
            {
                name: "tags0",
                type: "core::integer::u256"
            },
            {
                name: "tags1",
                type: "core::integer::u256"
            },
            {
                name: "tags2",
                type: "core::integer::u256"
            },
            {
                name: "tags3",
                type: "core::integer::u256"
            },
            {
                name: "latitude",
                type: "core::felt252"
            },
            {
                name: "longitude",
                type: "core::felt252"
            },
            {
                name: "pubkey_hi",
                type: "core::felt252"
            },
            {
                name: "pubkey_lo",
                type: "core::felt252"
            }
        ]
    },
    {
        type: "struct",
        name: "MessageSent",
        members: [
            {
                name: "sender",
                type: "core::starknet::contract_address::ContractAddress"
            },
            {
                name: "recipient",
                type: "core::starknet::contract_address::ContractAddress"
            },
            {
                name: "message",
                type: "core::array::Array::<core::felt252>"
            }
        ]
    }
] as const satisfies Abi

export { profileRegistryAbi } 