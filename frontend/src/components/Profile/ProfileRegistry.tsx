import { useAccount, useContract, useSendTransaction } from "@starknet-react/core"
import { useState } from "react"
import { CallData } from "starknet"
import { profileRegistryAbi } from "abi/profileRegistryAbi"
import { Button } from "components/Button"
import { useUserKeyGenerator } from "msg/UserKeyGenerator"
import { pubToFelts } from "msg/keyHelpers"

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
            const { publicKey } = await generateKeys()
            const [pubkeyHi, pubkeyLo] = pubToFelts(publicKey)

            // Update calldata with the public key
            const { transaction_hash } = await sendAsync([
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
                        pubkeyHi, // pubkey_hi (felt252)
                        pubkeyLo, // pubkey_lo (felt252)
                    ]),
                },
            ])

            setTimeout(() => {
                alert(`Transaction sent: ${transaction_hash}`)
            })
        } catch (error) {
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