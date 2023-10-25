
import { ThreeIdConnect, EthereumAuthProvider } from "@3id/connect";
import { DID } from "dids";
import { getResolver as getKeyResolver } from "key-did-resolver";
import { getResolver as get3IDResolver } from "@ceramicnetwork/3id-did-resolver";

export default async function auth3IDConnect(userAddress, ceramic) {
  if (!window.ethereum) {
    throw new Error("Not Web3 Provider found. Please install Metamask");
  }

  const threeID = new ThreeIdConnect();
  const authProvider = new EthereumAuthProvider(window.ethereum, userAddress);
  
  await threeID.connect(authProvider);
  const did = new DID({
    provider: threeID.getDidProvider(),
    resolver: { ...get3IDResolver(ceramic), ...getKeyResolver() },
  });

  await did.authenticate();
  ceramic.did = did
  
  return { ceramic, iframe: threeID.iframe }
}