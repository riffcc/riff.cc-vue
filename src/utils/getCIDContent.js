import axios from 'axios';

export default async function getCIDContent(ipfsGateway, cid) {
  const response = await axios.post(`https://${ipfsGateway}/api/v0/dag/get?arg=${cid}`);

  if (response.data["Data"]["/"].bytes === "CAE") {
    return response.data["Links"].map(link => ({ cid: link["Hash"]["/"], name: link["Name"]}))
  } else {
    throw new Error("Format not supported")
  }
}
