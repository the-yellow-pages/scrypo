import { useAccount, useContract, useSendTransaction } from "@starknet-react/core"
import { useState, useEffect } from "react"
import { CallData } from "starknet"
import { profileRegistryAbi } from "abi/profileRegistryAbi"
import { Button } from "components/Button"
import { useUserKeyGenerator } from "msg/UserKeyGenerator"
import { pubToFelts } from "msg/keyHelpers"
import { degToFelt } from "helpers/cords"
import type { ProfileResponse } from "../../api/types"

interface ProfileDeployFormProps {
  setLastTxError: (error: string) => void
  contractAddress: `0x${string}`
  existingProfile?: ProfileResponse | null
  onSuccess?: () => void
  publicKey?: string
  handleGenerateKeys?: () => Promise<void>
}

const ProfileDeployForm = ({
  setLastTxError,
  contractAddress,
  existingProfile,
  onSuccess,
  publicKey,
  handleGenerateKeys
}: ProfileDeployFormProps) => {
  const { account } = useAccount()
  const [lastTxStatus, setLastTxStatus] = useState("idle")
  const { generateKeys } = useUserKeyGenerator()

  // Form state
  const [name, setName] = useState("")
  const [tags0, setTags0] = useState("0")
  const [latitude, setLatitude] = useState("0")
  const [longitude, setLongitude] = useState("0")

  // Prefill form with existing profile data if available
  useEffect(() => {
    if (existingProfile) {
      setName(existingProfile.name || "")
      setTags0(existingProfile.tags0?.toString() || "0")
      if (existingProfile.location) {
        setLatitude(existingProfile.location.x.toString())
        setLongitude(existingProfile.location.y.toString())
      }
    }
  }, [existingProfile])

  const { contract } = useContract({
    abi: profileRegistryAbi,
    address: contractAddress,
  })

  const { sendAsync } = useSendTransaction({
    calls: [], // Initialize with empty calls array
  })
  const buttonsDisabled = ["approve"].includes(lastTxStatus)

  const handleDeployProfile = async (e: React.FormEvent) => {
    try {
      setLastTxError("")
      e.preventDefault()
      setLastTxStatus("approve")

      // Generate keys if needed and not already provided
      let pubkeyHi = "0x0"
      let pubkeyLo = "0x0"

      if (publicKey) {
        // Use provided public key
        try {
          [pubkeyHi, pubkeyLo] = pubToFelts(Buffer.from(publicKey, 'hex'))
        } catch (convError) {
          console.error("Error converting provided public key to felts:", convError)
          throw convError
        }
      } else if (handleGenerateKeys) {
        // Use the provided key generation function
        await handleGenerateKeys()
      } else {
        // Generate keys internally
        console.log("Starting key generation...")
        const { publicKey: newPublicKey } = await generateKeys()
        console.log("Generated public key:", newPublicKey)
        
        try {
          [pubkeyHi, pubkeyLo] = pubToFelts(newPublicKey)
          console.log("Converted to felts:", { pubkeyHi, pubkeyLo })
        } catch (convError) {
          console.error("Error converting public key to felts:", convError)
          throw convError
        }
      }

      // Use existing pubkey if available and no new key was generated
      if (existingProfile && pubkeyHi === "0x0" && existingProfile.pubkey_hi) {
        pubkeyHi = existingProfile.pubkey_hi
        pubkeyLo = existingProfile.pubkey_lo || "0x0"
      }

      if (!contract || !account?.address) {
        throw new Error("Contract or account not initialized")
      }

      const latitudeFelt = degToFelt(parseFloat(latitude)).toString()
      const longitudeFelt = degToFelt(parseFloat(longitude)).toString()
      const tagsValue = parseInt(tags0) || 0

      const calldata = CallData.compile([
        name || "0x0", // name (felt252)
        { low: tagsValue, high: 0 }, // tags0 (u256)
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
        if (onSuccess) onSuccess()
      }, 1000)
    } catch (error) {
      console.error("Full error object:", error)
      setLastTxError((error as Error).message)
    } finally {
      setLastTxStatus("idle")
    }
  }

  return (
    <div className="flex w-full column gap-4">
      <h3>{existingProfile ? "Update Profile" : "Create Profile"}</h3>
      
      <div className="form-group">
        <label htmlFor="name">Name:</label>
        <input 
          type="text" 
          id="name" 
          value={name} 
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter your name"
          className="w-full p-2 border rounded"
        />
      </div>

      <div className="form-group">
        <label htmlFor="tags0">Tags (numeric value):</label>
        <input 
          type="number" 
          id="tags0" 
          value={tags0} 
          onChange={(e) => setTags0(e.target.value)}
          placeholder="Enter tag value"
          className="w-full p-2 border rounded"
        />
      </div>

      <div className="form-group">
        <label htmlFor="latitude">Latitude:</label>
        <input 
          type="number" 
          id="latitude" 
          value={latitude} 
          onChange={(e) => setLatitude(e.target.value)}
          placeholder="Enter latitude"
          className="w-full p-2 border rounded"
          step="0.000001"
        />
      </div>

      <div className="form-group">
        <label htmlFor="longitude">Longitude:</label>
        <input 
          type="number" 
          id="longitude" 
          value={longitude} 
          onChange={(e) => setLongitude(e.target.value)}
          placeholder="Enter longitude"
          className="w-full p-2 border rounded"
          step="0.000001"
        />
      </div>

      {handleGenerateKeys && (
        <Button 
          onClick={handleGenerateKeys}
          disabled={buttonsDisabled}
          hideChevron
        >
          Generate Keys for Messaging
        </Button>
      )}

      {publicKey && (
        <div className="mt-2 p-2 bg-gray-100 rounded">
          <p className="font-bold">Generated Public Key:</p>
          <code className="block p-2 bg-gray-200 rounded break-all text-sm">
            {publicKey}
          </code>
        </div>
      )}

      <Button
        className="w-full"
        onClick={handleDeployProfile}
        disabled={buttonsDisabled}
        hideChevron
      >
        {lastTxStatus === "approve" ? "Waiting for transaction" : existingProfile ? "Update Profile" : "Deploy Profile"}
      </Button>
    </div>
  )
}

export { ProfileDeployForm } 