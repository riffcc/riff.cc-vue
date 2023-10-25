import axios from 'axios';
import {
  INFURA_API_URL,
  INFURA_API_KEY,
  INFURA_API_KEY_SECRET
} from '../config/constants'


export default async function getCIDContent(cid) {
  if (!INFURA_API_KEY || !INFURA_API_KEY_SECRET) throw new Error("INFURA_API_KEY or INFURA_API_KEY_SECRET env vars undefined")
  const credentials = `${INFURA_API_KEY}:${INFURA_API_KEY_SECRET}`;

  const response = await axios.post(
    `https://${INFURA_API_URL}/api/v0/dag/get?arg=${cid}`,
    undefined,
    {
      headers: {
        "Authorization": `Basic ${btoa(credentials)}`
      }
    });
  const data = response.data["Data"]
  console.log('data', data)
  if (data && data["/"].bytes === "CAE") {
    return response.data["Links"].map(link => ({ cid: link["Hash"]["/"], name: link["Name"].replace(/^\d+\s*(.*?)\.\w+$/, '$1') }))
  } else {
    throw new Error("Format not supported")
  }
}
