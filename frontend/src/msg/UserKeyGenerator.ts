import { useAccount } from "@starknet-react/core"
import { keccak_256 } from "@noble/hashes/sha3"
import sodium from "libsodium-wrappers"

export interface KeyGenerationData {
    purpose: string
}

export interface TypedData {
    types: {
        StarkNetDomain: Array<{ name: string; type: string }>
        DeriveKey: Array<{ name: string; type: string }>
    }
    primaryType: string
    domain: {
        name: string
        version: string
        chainId: string
    }
    message: KeyGenerationData
}

export class UserKeyGenerator {
    private static readonly PURPOSE = 0x4B4559n // "KEY"
    private static readonly DOMAIN = {
        name: "StarkChat.KDF",
        version: "1",
        chainId: "SN_SEPOLIA",
    }

    private static readonly TYPED_DATA = {
        types: {
            StarkNetDomain: [
                { name: "name", type: "felt" },
                { name: "version", type: "felt" },
                { name: "chainId", type: "felt" },
            ],
            DeriveKey: [
                { name: "purpose", type: "felt" },
            ],
        },
        primaryType: "DeriveKey",
        domain: UserKeyGenerator.DOMAIN,
        message: {
            purpose: UserKeyGenerator.PURPOSE.toString(),
        },
    } as const

    public static async generateKeys(
        account: any
    ): Promise<{ publicKey: Uint8Array; privateKey: Uint8Array }> {
        await sodium.ready

        const rawSig = await account.signMessage(this.TYPED_DATA)
        // console.log('Raw signature:', rawSig)
        const sigHex = rawSig.join("").replace(/^0x/, "")
        // console.log('Signature hex:', sigHex)

        const seed = keccak_256(sigHex)
        // console.log('Seed length:', seed.length)
        // console.log('Seed:', Array.from(seed).map(b => b.toString(16).padStart(2, '0')).join(''))

        const keypair = sodium.crypto_box_seed_keypair(seed)
        // console.log('Generated public key length:', keypair.publicKey.length)
        // console.log('Generated private key length:', keypair.privateKey.length)
        return keypair
    }
}

// React hook for generating user keys
export function useUserKeyGenerator() {
    const { account } = useAccount()

    const generateKeys = async () => {
        if (!account) {
            throw new Error("No account connected")
        }

        return UserKeyGenerator.generateKeys(account)
    }

    return {
        generateKeys,
        isConnected: !!account,
    }
} 