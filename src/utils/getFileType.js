import axios from "axios";

export default async function getFileType(ipfsGateway, cid) {
  const response = await axios.head(`https://${ipfsGateway}/ipfs/${cid}`)
  return response.headers['content-type']
}