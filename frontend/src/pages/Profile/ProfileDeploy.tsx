import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAccount, useContract, useSendTransaction } from "@starknet-react/core";
import { CallData } from "starknet";
import { profileRegistryAbi } from "abi/profileRegistryAbi";
import { useUserKeyGenerator } from "msg/UserKeyGenerator";
import { pubToFelts } from "msg/keyHelpers";
import { degToFelt } from "helpers/cords";
import { AVAILABLE_TAGS } from "../../components/Tags/tags";
import { ProfileDeployForm } from "../../components/Profile/ProfileDeployForm";
import type { ProfileResponse } from "../../api/types";
import "../../styles/form.css";

function ProfileDeploy() {
    const [lastTxError, setLastTxError] = useState("");
    const [lastTxStatus, setLastTxStatus] = useState("idle");
    const navigate = useNavigate();
    const location = useLocation();
    const existingProfile = location.state?.profile as ProfileResponse | undefined;
    const { account } = useAccount();
    const { generateKeys } = useUserKeyGenerator();

    const profilesContractAddress = import.meta.env.VITE_PROFILES_CONTRACT_ADDRESS;
    if (!profilesContractAddress) {
        throw new Error("VITE_PROFILES_CONTRACT_ADDRESS environment variable is not set");
    }

    const { contract } = useContract({
        abi: profileRegistryAbi,
        address: profilesContractAddress as `0x${string}`,
    });

    const { sendAsync } = useSendTransaction({
        calls: [],
    });

    const buttonsDisabled = ["approve"].includes(lastTxStatus);

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

    const handleFormSubmit = async (formData: {
        name: string;
        selectedTags: string[];
        latitude: string;
        longitude: string;
    }) => {
        try {
            setLastTxError("");
            setLastTxStatus("approve");

            // Always generate new keys
            console.log("Starting key generation...");
            const { publicKey: newPublicKey } = await generateKeys();
            console.log("Generated public key:", newPublicKey);

            let pubkeyHi: string, pubkeyLo: string;
            try {
                [pubkeyHi, pubkeyLo] = pubToFelts(newPublicKey);
                console.log("Converted to felts:", { pubkeyHi, pubkeyLo });

                // Ensure keys are not zero
                if (pubkeyHi === "0x0" || pubkeyLo === "0x0") {
                    throw new Error("Generated keys cannot be zero");
                }
            } catch (convError) {
                console.error("Error converting public key to felts:", convError);
                throw convError;
            }

            if (!contract || !account?.address) {
                throw new Error("Contract or account not initialized");
            }

            const latitudeFelt = degToFelt(parseFloat(formData.latitude)).toString();
            const longitudeFelt = degToFelt(parseFloat(formData.longitude)).toString();
            const { tags0, tags1 } = convertTagsToBitFlags(formData.selectedTags);

            const calldata = CallData.compile([
                formData.name || "0x0", // name (felt252)
                { low: tags0, high: 0 }, // tags0 (u256)
                { low: tags1, high: 0 }, // tags1 (u256)
                { low: 0, high: 0 }, // tags2 (u256)
                { low: 0, high: 0 }, // tags3 (u256)
                latitudeFelt, // latitude (felt252)
                longitudeFelt, // longitude (felt252)
                pubkeyHi, // pubkey_hi (felt252)
                pubkeyLo, // pubkey_lo (felt252)
            ]);
            console.log("Compiled calldata:", calldata);

            console.log("Sending transaction...");
            const { transaction_hash } = await sendAsync([
                {
                    contractAddress: profilesContractAddress as `0x${string}`,
                    entrypoint: "deploy_profile",
                    calldata,
                },
            ]);

            console.log("Transaction sent:", transaction_hash);
            setTimeout(() => {
                alert(`Transaction sent: ${transaction_hash}`);
                navigate(-1);
            }, 1000);
        } catch (error) {
            console.error("Full error object:", error);
            setLastTxError((error as Error).message);
        } finally {
            setLastTxStatus("idle");
        }
    };

    return (
        <div className="p-4 max-w-2xl mx-auto">
            {lastTxError && (
                <div className="error-message p-4 bg-red-100 border border-red-400 rounded mb-4">
                    <p>Error: {lastTxError}</p>
                </div>
            )}

            <div className="bg-white p-6 rounded-lg shadow">
                <ProfileDeployForm
                    setLastTxError={setLastTxError}
                    contractAddress={profilesContractAddress as `0x${string}`}
                    existingProfile={existingProfile}
                    onSubmit={handleFormSubmit}
                />

                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    gap: '16px',
                    marginTop: '24px'
                }}>
                    <button
                        onClick={() => navigate(-1)}
                        className="form-button form-button-large form-button-secondary"
                    >
                        ← Back
                    </button>

                    <button
                        type="submit"
                        form="profile-form"
                        className={`form-button form-button-large ${buttonsDisabled ? 'disabled' : ''}`}
                        disabled={buttonsDisabled}
                        onClick={(e) => {
                            const form = document.querySelector('form') as HTMLFormElement;
                            if (form) {
                                form.requestSubmit();
                            }
                        }}
                    >
                        {lastTxStatus === "approve" ? "Waiting for transaction" : existingProfile ? "Update Profile" : "Deploy Profile"}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default ProfileDeploy;