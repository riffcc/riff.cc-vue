import { NFTStorage } from 'nft.storage';
const NFT_STORAGE_KEY = import.meta.env.VITE_NFT_STORAGE_KEY

export default async function uploadToIPFS(files) {
  const client = new NFTStorage({ token: NFT_STORAGE_KEY})

  try {
    if (files.length > 1) {
      return await client.storeDirectory(files);
    } else {
      return await client.storeBlob(files[0]);
    }
  } catch (error) {
    throw error;
  }
}
