import { CeramicClient } from "@ceramicnetwork/http-client";

export default function createCeramicClient() {
  return new CeramicClient(import.meta.env.VITE_NODE_URL);
}