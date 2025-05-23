import { defineConfig } from "apibara/config";

export default defineConfig({
    runtimeConfig: {
        /** values are injected into the indexer at runtime */
        profiles: {
            streamUrl: process.env.STREAM_URL!,
            startingBlock: Number(process.env.START_BLOCK ?? 0),
            contractAddress: process.env.CONTRACT_ADDRESS!,
        }
    },
});
