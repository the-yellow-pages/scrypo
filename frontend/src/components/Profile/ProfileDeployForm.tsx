import { useAccount, useContract, useSendTransaction } from "@starknet-react/core"
import { useState, useEffect } from "react"
import { CallData } from "starknet"
import { profileRegistryAbi } from "abi/profileRegistryAbi"
import { useUserKeyGenerator } from "msg/UserKeyGenerator"
import { pubToFelts } from "msg/keyHelpers"
import { degToFelt } from "helpers/cords"
import { TagSelector } from "components/Tags/TagSelector"
import { CitySelector } from "components/Location/CitySelector"
import { AVAILABLE_TAGS } from "components/Tags/tags"
import type { ProfileResponse } from "../../api/types"
import "../../styles/form.css"

interface ProfileDeployFormProps {
  setLastTxError: (error: string) => void
  contractAddress: `0x${string}`
  existingProfile?: ProfileResponse | null
  onSuccess?: () => void
  onSubmit?: (formData: {
    name: string;
    selectedTags: string[];
    latitude: string;
    longitude: string;
  }) => Promise<void>
}

const ProfileDeployForm = ({
  setLastTxError,
  contractAddress,
  existingProfile,
  onSuccess,
  onSubmit,
}: ProfileDeployFormProps) => {
  const { account } = useAccount()
  const [lastTxStatus, setLastTxStatus] = useState("idle")
  const { generateKeys } = useUserKeyGenerator()

  // Form state
  const [name, setName] = useState("")
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [latitude, setLatitude] = useState("0")
  const [longitude, setLongitude] = useState("0")
  const [selectedCity, setSelectedCity] = useState("")

  // Convert tag IDs to bit flags
  const convertTagsToBitFlags = (tagIds: string[]) => {
    let tags0 = 0;
    let tags1 = 0;

    tagIds.forEach(tagId => {
      const tagIndex = AVAILABLE_TAGS.findIndex(tag => tag.id === tagId);
      if (tagIndex >= 0) {
        if (tagIndex < 32) {
          tags0 |= (1 << tagIndex);
        } else if (tagIndex < 64) {
          tags1 |= (1 << (tagIndex - 32));
        }
      }
    });

    return { tags0, tags1 };
  };

  // Convert bit flags back to tag IDs
  const convertBitFlagsToTags = (tags0: number, tags1: number) => {
    const tagIds: string[] = [];

    for (let i = 0; i < AVAILABLE_TAGS.length; i++) {
      let isSet = false;

      if (i < 32) {
        isSet = (tags0 & (1 << i)) !== 0;
      } else if (i < 64) {
        isSet = (tags1 & (1 << (i - 32))) !== 0;
      }

      if (isSet) {
        tagIds.push(AVAILABLE_TAGS[i].id);
      }
    }

    return tagIds;
  };

  // Prefill form with existing profile data if available
  useEffect(() => {
    if (existingProfile) {
      setName(existingProfile.name || "")

      // Convert existing tags to selected tag IDs - ensure proper number conversion
      const tags0Value = typeof existingProfile.tags0 === 'string'
        ? parseInt(existingProfile.tags0, 10) || 0
        : existingProfile.tags0 || 0;
      const tags1Value = typeof existingProfile.tags1 === 'string'
        ? parseInt(existingProfile.tags1, 10) || 0
        : existingProfile.tags1 || 0;

      const existingTagIds = convertBitFlagsToTags(tags0Value, tags1Value);
      setSelectedTags(existingTagIds);

      if (existingProfile.location) {
        setLatitude(existingProfile.location.y.toString())
        setLongitude(existingProfile.location.x.toString())
        // Set a generic city name for existing profiles
        setSelectedCity(`${existingProfile.location.x}, ${existingProfile.location.y}`)
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

  const handleCitySelect = (city: { name: string; latitude: number; longitude: number }) => {
    setSelectedCity(city.name)
    setLatitude(city.latitude.toString())
    setLongitude(city.longitude.toString())
  }

  const handleDeployProfile = async (e: React.FormEvent) => {
    e.preventDefault()

    if (onSubmit) {
      await onSubmit({
        name,
        selectedTags,
        latitude,
        longitude,
      })
      return
    }

    try {
      setLastTxError("")
      setLastTxStatus("approve")

      // Always generate new keys
      console.log("Starting key generation...")
      const { publicKey: newPublicKey } = await generateKeys()
      console.log("Generated public key:", newPublicKey)

      let pubkeyHi: string, pubkeyLo: string;
      try {
        [pubkeyHi, pubkeyLo] = pubToFelts(newPublicKey)
        console.log("Converted to felts:", { pubkeyHi, pubkeyLo })

        // Ensure keys are not zero
        if (pubkeyHi === "0x0" || pubkeyLo === "0x0") {
          throw new Error("Generated keys cannot be zero")
        }
      } catch (convError) {
        console.error("Error converting public key to felts:", convError)
        throw convError
      }

      if (!contract || !account?.address) {
        throw new Error("Contract or account not initialized")
      }

      const latitudeFelt = degToFelt(parseFloat(latitude)).toString()
      const longitudeFelt = degToFelt(parseFloat(longitude)).toString()
      const { tags0, tags1 } = convertTagsToBitFlags(selectedTags);

      const calldata = CallData.compile([
        name || "0x0", // name (felt252)
        { low: tags0, high: 0 }, // tags0 (u256)
        { low: tags1, high: 0 }, // tags1 (u256)
        { low: 0, high: 0 }, // tags2 (u256)
        { low: 0, high: 0 }, // tags3 (u256)
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
    <form className="form-container" onSubmit={handleDeployProfile}>
      <h3 className="form-title">
        {existingProfile ? "Update Profile" : "Create Profile"}
      </h3>

      <div className="form-group">
        <label htmlFor="name" className="form-label">
          Name:
        </label>
        <input
          type="text"
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter your name"
          className="form-input"
        />
      </div>

      <TagSelector
        selectedTags={selectedTags}
        onTagsChange={setSelectedTags}
        maxTags={10}
      />

      <div className="form-grid-3">
        <CitySelector
          onCitySelect={handleCitySelect}
          initialValue={selectedCity}
          disabled={buttonsDisabled}
        />

        <div className="form-group">
          <label htmlFor="latitude" className="form-label">
            Latitude:
          </label>
          <input
            type="number"
            id="latitude"
            value={latitude}
            onChange={(e) => setLatitude(e.target.value)}
            placeholder="Enter latitude"
            step="0.000001"
            className="form-input"
            readOnly
          />
        </div>

        <div className="form-group">
          <label htmlFor="longitude" className="form-label">
            Longitude:
          </label>
          <input
            type="number"
            id="longitude"
            value={longitude}
            onChange={(e) => setLongitude(e.target.value)}
            placeholder="Enter longitude"
            step="0.000001"
            className="form-input"
            readOnly
          />
        </div>
      </div>
    </form>
  )
}

export { ProfileDeployForm }