import { NFTStorage } from 'nft.storage';
import { NFT_STORAGE_KEY } from '../config/constants'

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
