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
        type: "event",
        name: "ProfileUpdated",
        kind: "struct",
        members: [
            { name: "addr", type: "core::starknet::contract_address::ContractAddress", kind: "data" },
            { name: "name", type: "core::felt252", kind: "data" },
            { name: "tags0", type: "core::integer::u256", kind: "data" },
            { name: "tags1", type: "core::integer::u256", kind: "data" },
            { name: "tags2", type: "core::integer::u256", kind: "data" },
            { name: "tags3", type: "core::integer::u256", kind: "data" },
            { name: "latitude", type: "core::felt252", kind: "data" },
            { name: "longitude", type: "core::felt252", kind: "data" },
            { name: "pubkey_hi", type: "core::felt252", kind: "data" },
            { name: "pubkey_lo", type: "core::felt252", kind: "data" }
        ]
    },
    {
        type: "event",
        name: "MessageSent",
        kind: "struct",
        members: [
            { name: "sender", type: "core::starknet::contract_address::ContractAddress", kind: "data" },
            { name: "recipient", type: "core::starknet::contract_address::ContractAddress", kind: "data" },
            { name: "message", type: "core::array::Array::<core::felt252>", kind: "data" }
        ]
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
] as const satisfies Abi

export { profileRegistryAbi } 