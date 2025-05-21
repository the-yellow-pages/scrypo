import { useAccount, useContract, useSendTransaction } from "@starknet-react/core"
import { useState } from "react"
import { CallData, uint256 } from "starknet"
import { profileRegistryAbi } from "abi/profileRegistryAbi"
import { Button } from "components/Button"
import { useUserKeyGenerator } from "msg/UserKeyGenerator"
import { pubToFelts } from "msg/keyHelpers"
import { degToFelt } from "helpers/cords"

const ProfileRegistry = ({
    setLastTxError,
    contractAddress,
}: {
    setLastTxError: (error: string) => void
    contractAddress: `0x${string}`
}) => {
    const { account } = useAccount()
    const [lastTxStatus, setLastTxStatus] = useState("idle")
    const { generateKeys } = useUserKeyGenerator()

    const { contract } = useContract({
        abi: profileRegistryAbi,
        address: contractAddress,
    })

    const { sendAsync } = useSendTransaction({
        calls:
            contract && account?.address
                ? [
                    {
                        contractAddress,
                        entrypoint: "deploy_profile",
                        calldata: CallData.compile([
                            "0x123", // name (felt252)
                            "0x0", // tags0 (u256)
                            "0x0", // tags1 (u256)
                            "0x0", // tags2 (u256)
                            "0x0", // tags3 (u256)
                            "0x0", // latitude (felt252)
                            "0x0", // longitude (felt252)
                            "0x0", // pubkey_hi (felt252) - will be updated
                            "0x0", // pubkey_lo (felt252) - will be updated
                        ]),
                    },
                ]
                : undefined,
    })

    const buttonsDisabled = ["approve"].includes(lastTxStatus)

    const handleDeployProfile = async (e: React.FormEvent) => {
        try {
            setLastTxError("")
            e.preventDefault()
            setLastTxStatus("approve")

            // Generate keys first
            console.log("Starting key generation...")
            const { publicKey } = await generateKeys()
            console.log("Generated public key:", publicKey)
            console.log("Public key type:", typeof publicKey)
            console.log("Public key length:", publicKey.length)
            
            let pubkeyHi: string
            let pubkeyLo: string
            
            console.log("Converting public key to felts...")
            try {
                [pubkeyHi, pubkeyLo] = pubToFelts(publicKey)
                console.log("Converted to felts:", { pubkeyHi, pubkeyLo })
            } catch (convError) {
                console.error("Error converting public key to felts:", convError)
                throw convError
            }

            // Update calldata with the public key
            console.log("Preparing transaction...")
            console.log("Contract address:", contractAddress)
            console.log("Account address:", account?.address)
            
            if (!contract || !account?.address) {
                throw new Error("Contract or account not initialized")
            }
            const cords = { latitude: 42.712645, longitude: 2.966081 };
            const latitudeFelt = degToFelt(cords.latitude).toString()
            const longitudeFelt = degToFelt(cords.longitude).toString()

            const calldata = CallData.compile([
                "0x123", // name (felt252)
                { low: 9283749, high: 0 }, // tags0 (u256)
                { low: 0, high: 0}, // tags1 (u256)
                { low: 0, high: 0}, // tags2 (u256)
                { low: 0, high: 0}, // tags3 (u256)
                latitudeFelt, // latitude (felt252)
                longitudeFelt, // longitude (felt252)
                pubkeyHi, // pubkey_hi (felt252)
                pubkeyLo, // pubkey_lo (felt252)
            ])
            console.log("Compiled calldata:", calldata)

            console.log("Sending transaction...")
            const { transaction_hash } = await sendAsync([
                {
                    contractAddress,
                    entrypoint: "deploy_profile",
                    calldata,
                },
            ])
            console.log("Transaction sent:", transaction_hash)
            setTimeout(() => {
                alert(`Transaction sent: ${transaction_hash}`)
            })
        } catch (error) {
            console.error("Full error object:", error)
            console.error("Error stack:", (error as Error).stack)
            setLastTxError((error as Error).message)
        } finally {
            setLastTxStatus("idle")
        }
    }

    return (
        <div className="flex w-full column gap-2">
            <Button
                className="w-full"
                onClick={handleDeployProfile}
                disabled={buttonsDisabled}
                hideChevron
            >
                {lastTxStatus === "approve" ? "Waiting for transaction" : "Deploy Profile"}
            </Button>
        </div>
    )
}

export { ProfileRegistry } 