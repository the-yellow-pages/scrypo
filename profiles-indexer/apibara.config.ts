import { defineConfig } from "apibara/config";

export default defineConfig({
  runtimeConfig: {
    profiles: {
      startingBlock: 0,
      streamUrl: "https://sepolia.starknet.a5a.ch",
    },
  },
});
